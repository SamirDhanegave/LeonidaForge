from flask import Flask, jsonify, request
from flask_cors import CORS

import atexit
import os
import subprocess
import sys
import threading
from collections import deque
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()


# ============================================================
# FLASK
# ============================================================

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
)


# ============================================================
# PATHS / CONFIG
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT", 5000))

# Persistent collectors can be started/stopped from /admin.
# General news is a one-shot job: run -> collect -> exit.
SERVICES = {
    "watcher": {
        "name": "X Watcher",
        "module": "main.watcher",
        "type": "persistent",
    },
    "news": {
        "name": "Rockstar Newswire",
        "module": "main.news",
        "type": "persistent",
    },
    "general_news": {
        "name": "General GTA VI News",
        "module": "main.general_news",
        "type": "oneshot",
    },
}

STAGE_LABELS = {
    "posts": "Writing X posts",
    "news": "Writing news articles",
    "scripts": "Generating scripts",
}


# ============================================================
# RUNTIME STATE
# ============================================================

service_processes = {}
service_lock = threading.RLock()
activity_log = deque(maxlen=150)

script_job_lock = threading.RLock()
script_job = {
    "status": "idle",
    "started_at": None,
    "finished_at": None,
    "stage": None,
    "stage_label": None,
    "total": 0,
    "processed": 0,
    "current_news_id": None,
    "current_title": None,
    "posts_classified": 0,
    "news_classified": 0,
    "scripts_generated": 0,
    "errors": [],
    "last_error": None,
    "force": False,
}


# ============================================================
# HELPERS
# ============================================================

def now_iso():
    return datetime.now(timezone.utc).isoformat()


def log_activity(message):
    entry = {
        "timestamp": now_iso(),
        "message": message,
    }
    activity_log.appendleft(entry)
    print(message, flush=True)


def get_supabase():
    from lib.supabase_client import supabase
    return supabase


def get_process(service_id):
    return service_processes.get(service_id)


def is_running(service_id):
    process = get_process(service_id)
    return process is not None and process.poll() is None


def service_status(service_id):
    config = SERVICES[service_id]
    process = get_process(service_id)

    if process is None:
        return {
            "id": service_id,
            "name": config["name"],
            "module": config["module"],
            "type": config["type"],
            "status": "idle" if config["type"] == "oneshot" else "stopped",
            "running": False,
            "pid": None,
            "exit_code": None,
            "started_at": None,
            "finished_at": None,
        }

    running = process.poll() is None
    exit_code = None if running else process.returncode

    if running:
        status = "running"
    elif config["type"] == "oneshot" and exit_code == 0:
        status = "idle"
    else:
        status = "stopped"

    return {
        "id": service_id,
        "name": config["name"],
        "module": config["module"],
        "type": config["type"],
        "status": status,
        "running": running,
        "pid": process.pid if running else None,
        "exit_code": exit_code,
        "started_at": getattr(process, "_lf_started_at", None),
        "finished_at": getattr(process, "_lf_finished_at", None),
    }


def refresh_finished_processes():
    with service_lock:
        for service_id, process in list(service_processes.items()):
            if process.poll() is None:
                continue

            if not hasattr(process, "_lf_finished_at"):
                process._lf_finished_at = now_iso()
                code = process.returncode

                if code == 0:
                    log_activity(
                        f"✅ {SERVICES[service_id]['name']} finished successfully."
                    )
                else:
                    log_activity(
                        f"❌ {SERVICES[service_id]['name']} exited with code {code}."
                    )


def _read_process_output(service_id, process):
    try:
        if process.stdout is None:
            return

        for raw_line in process.stdout:
            line = raw_line.strip()
            if line:
                log_activity(f"[{SERVICES[service_id]['name']}] {line}")
    except Exception as error:
        log_activity(
            f"⚠️ Could not read {SERVICES[service_id]['name']} output: {error}"
        )


def start_service(service_id):
    if service_id not in SERVICES:
        raise ValueError(f"Unknown service: {service_id}")

    config = SERVICES[service_id]

    with service_lock:
        refresh_finished_processes()

        if is_running(service_id):
            process = get_process(service_id)
            return {
                "started": False,
                "already_running": True,
                "pid": process.pid,
            }

        log_activity(f"▶ Starting {config['name']} ({config['module']})...")

        env = os.environ.copy()
        env["PYTHONUNBUFFERED"] = "1"

        try:
            process = subprocess.Popen(
                [sys.executable, "-u", "-m", config["module"]],
                cwd=str(BASE_DIR),
                stdin=subprocess.DEVNULL,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                errors="replace",
                bufsize=1,
                env=env,
            )
        except Exception as error:
            log_activity(f"❌ Failed to start {config['name']}: {error}")
            raise

        process._lf_started_at = now_iso()
        process._lf_finished_at = None
        service_processes[service_id] = process

        reader = threading.Thread(
            target=_read_process_output,
            args=(service_id, process),
            name=f"{service_id}-log-reader",
            daemon=True,
        )
        reader.start()

        log_activity(f"✅ {config['name']} started (PID: {process.pid})")

        return {
            "started": True,
            "already_running": False,
            "pid": process.pid,
        }


def stop_service(service_id):
    if service_id not in SERVICES:
        raise ValueError(f"Unknown service: {service_id}")

    with service_lock:
        process = get_process(service_id)

        if process is None or process.poll() is not None:
            return {
                "stopped": False,
                "already_stopped": True,
            }

        log_activity(
            f"⏹ Stopping {SERVICES[service_id]['name']} (PID: {process.pid})..."
        )

        try:
            process.terminate()
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            log_activity(
                f"⚠️ {SERVICES[service_id]['name']} did not stop in time; killing it."
            )
            process.kill()
            process.wait(timeout=5)
        except Exception as error:
            log_activity(
                f"❌ Failed to stop {SERVICES[service_id]['name']}: {error}"
            )
            raise
        finally:
            process._lf_finished_at = now_iso()

        log_activity(f"✅ {SERVICES[service_id]['name']} stopped.")

        return {
            "stopped": True,
            "already_stopped": False,
        }


def stop_all_services():
    with service_lock:
        for service_id in list(SERVICES.keys()):
            try:
                stop_service(service_id)
            except Exception as error:
                log_activity(
                    f"⚠️ Could not stop {SERVICES[service_id]['name']}: {error}"
                )


atexit.register(stop_all_services)


# ============================================================
# AI PIPELINE JOB
# ============================================================

def get_script_job():
    with script_job_lock:
        job = dict(script_job)
        job["errors"] = list(job.get("errors") or [])
        return job


def _set_script_job(**updates):
    with script_job_lock:
        script_job.update(updates)


def _fetch_news_by_id(news_id):
    sb = get_supabase()
    response = (
        sb.table("news")
        .select("*")
        .eq("id", news_id)
        .maybe_single()
        .execute()
    )
    return response.data


def _job_on_log(message):
    log_activity(message)


def _job_on_progress(**fields):
    """Callback handed to ai.run_pipeline so the admin panel can follow along."""
    updates = {}

    if "stage" in fields:
        stage = fields["stage"]
        updates["stage"] = stage
        updates["stage_label"] = STAGE_LABELS.get(stage, stage)

    for key in ("total", "processed", "current_news_id", "current_title"):
        if key in fields:
            updates[key] = fields[key]

    if updates:
        _set_script_job(**updates)


def _run_pipeline_job(news_id=None, force=False):
    """Run the full AI pipeline in a background thread."""
    try:
        from main.ai import run_pipeline

        if news_id is not None:
            selected = _fetch_news_by_id(news_id)
            if not selected:
                raise ValueError(f"News #{news_id} was not found")

        _set_script_job(
            status="running",
            stage=None,
            stage_label=None,
            total=0,
            processed=0,
            current_news_id=news_id,
            current_title=None,
            posts_classified=0,
            news_classified=0,
            scripts_generated=0,
            errors=[],
            last_error=None,
            force=force,
        )

        log_activity(
            "🤖 AI pipeline started"
            + (f" for News #{news_id}." if news_id else " for all pending rows.")
        )

        summary = run_pipeline(
            news_id=news_id,
            force=force,
            on_log=_job_on_log,
            on_progress=_job_on_progress,
        )

        errors = summary.get("errors") or []

        _set_script_job(
            status="completed_with_errors" if errors else "completed",
            finished_at=now_iso(),
            stage=None,
            stage_label=None,
            current_news_id=None,
            current_title=None,
            posts_classified=summary.get("posts_classified", 0),
            news_classified=summary.get("news_classified", 0),
            scripts_generated=summary.get("scripts_generated", 0),
            errors=errors,
            last_error=errors[-1] if errors else None,
        )

        log_activity("✅ AI pipeline finished.")

    except Exception as error:
        log_activity(f"❌ AI pipeline failed: {error}")
        _set_script_job(
            status="failed",
            finished_at=now_iso(),
            stage=None,
            stage_label=None,
            last_error=str(error),
            current_news_id=None,
            current_title=None,
        )


def start_script_job(news_id=None, force=False):
    with script_job_lock:
        if script_job["status"] in ("starting", "running"):
            return {
                "started": False,
                "already_running": True,
                "job": dict(script_job),
            }

        script_job.update({
            "status": "starting",
            "started_at": now_iso(),
            "finished_at": None,
            "stage": None,
            "stage_label": None,
            "total": 0,
            "processed": 0,
            "current_news_id": news_id,
            "current_title": None,
            "posts_classified": 0,
            "news_classified": 0,
            "scripts_generated": 0,
            "errors": [],
            "last_error": None,
            "force": force,
        })

    thread = threading.Thread(
        target=_run_pipeline_job,
        args=(news_id, force),
        name="ai-pipeline-job",
        daemon=True,
    )
    thread.start()

    log_activity(
        "▶ AI pipeline requested"
        + (f" for News #{news_id}." if news_id else " for pending rows.")
    )

    return {
        "started": True,
        "already_running": False,
        "job": get_script_job(),
    }


# ============================================================
# HEALTH
# ============================================================

@app.route("/api/health")
def health():
    refresh_finished_processes()
    return jsonify({
        "status": "ok",
        "service": "leonida-forge-api",
        "timestamp": now_iso(),
    })


# ============================================================
# PUBLIC NEWS
# ============================================================

@app.route("/api/news")
def get_news():
    try:
        page = max(1, int(request.args.get("page", 1)))
        limit = min(50, max(1, int(request.args.get("limit", 12))))
        source = request.args.get("source")
        offset = (page - 1) * limit

        sb = get_supabase()
        query = sb.table("news").select("*").order("collected_at", desc=True)

        if source:
            query = query.eq("source", source)

        response = query.range(offset, offset + limit - 1).execute()

        return jsonify({
            "data": response.data or [],
            "page": page,
            "limit": limit,
        })

    except ValueError:
        return jsonify({"error": "page and limit must be numbers"}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/news/latest")
def get_latest_news():
    try:
        sb = get_supabase()
        response = (
            sb.table("news")
            .select("*")
            .order("collected_at", desc=True)
            .limit(6)
            .execute()
        )
        return jsonify({"data": response.data or []})
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/news/<int:news_id>")
def get_news_item(news_id):
    try:
        article = _fetch_news_by_id(news_id)
        if not article:
            return jsonify({"error": "Not found"}), 404
        return jsonify(article)
    except Exception as error:
        return jsonify({"error": str(error)}), 500


# ============================================================
# PUBLIC SOCIAL / X
# ============================================================

@app.route("/api/social")
def get_social():
    try:
        page = max(1, int(request.args.get("page", 1)))
        limit = min(50, max(1, int(request.args.get("limit", 20))))
        offset = (page - 1) * limit

        sb = get_supabase()
        response = (
    sb.table("monitored_posts")
    .select("id,agent,classifier,username,post_id,date,created_at,url")
    .order("date", desc=True)
    .range(offset, offset + limit - 1)
    .execute()
)
        return jsonify({
            "data": response.data or [],
            "page": page,
            "limit": limit,
        })

    except ValueError:
        return jsonify({"error": "page and limit must be numbers"}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500


# ============================================================
# PUBLIC SCRIPTS
# ============================================================

@app.route("/api/scripts")
def get_scripts():
    try:
        sb = get_supabase()
        response = (
            sb.table("scripts")
            .select("*, news(id, title, url, source, raw_content, classifier)")
            .order("created_at", desc=True)
            .execute()
        )
        return jsonify({"data": response.data or []})
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/scripts/<int:script_id>")
def get_script(script_id):
    try:
        sb = get_supabase()
        response = (
            sb.table("scripts")
            .select("*, news(id, title, url, source, raw_content, classifier)")
            .eq("id", script_id)
            .maybe_single()
            .execute()
        )

        if not response.data:
            return jsonify({"error": "Not found"}), 404

        return jsonify(response.data)

    except Exception as error:
        return jsonify({"error": str(error)}), 500


# ============================================================
# ADMIN — SERVICES
# ============================================================

@app.route("/api/admin/services")
def admin_services():
    refresh_finished_processes()
    return jsonify({
        "data": [service_status(service_id) for service_id in SERVICES]
    })


@app.route("/api/admin/services/<service_id>/start", methods=["POST"])
def admin_start_service(service_id):
    try:
        result = start_service(service_id)
        return jsonify({
            "success": True,
            "result": result,
            "service": service_status(service_id),
        })
    except ValueError as error:
        return jsonify({"error": str(error)}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/admin/services/<service_id>/stop", methods=["POST"])
def admin_stop_service(service_id):
    try:
        result = stop_service(service_id)
        return jsonify({
            "success": True,
            "result": result,
            "service": service_status(service_id),
        })
    except ValueError as error:
        return jsonify({"error": str(error)}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/admin/services/<service_id>/run", methods=["POST"])
def admin_run_service(service_id):
    if service_id not in SERVICES:
        return jsonify({"error": f"Unknown service: {service_id}"}), 404

    if SERVICES[service_id]["type"] != "oneshot":
        return jsonify({"error": f"{service_id} is a persistent service. Use start instead."}), 400

    try:
        result = start_service(service_id)
        return jsonify({
            "success": True,
            "result": result,
            "service": service_status(service_id),
        })
    except Exception as error:
        return jsonify({"error": str(error)}), 500


# ============================================================
# ADMIN — AI PIPELINE
# ============================================================

@app.route("/api/admin/scripts/status")
@app.route("/api/admin/pipeline/status")
def admin_script_status():
    return jsonify({"job": get_script_job()})


@app.route("/api/admin/scripts/run", methods=["POST"])
@app.route("/api/admin/pipeline/run", methods=["POST"])
def admin_run_scripts():
    payload = request.get_json(silent=True) or {}
    raw_news_id = payload.get("news_id")
    force = bool(payload.get("force", False))

    try:
        news_id = int(raw_news_id) if raw_news_id is not None else None
    except (TypeError, ValueError):
        return jsonify({"error": "news_id must be an integer"}), 400

    try:
        result = start_script_job(news_id=news_id, force=force)
        return jsonify({"success": True, **result})
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/admin/pipeline/pending")
def admin_pipeline_pending():
    """How much work each stage currently has waiting."""
    try:
        from main.ai import (
            posts_needing_classifier,
            news_needing_classifier,
            news_without_scripts,
        )

        return jsonify({
            "posts": len(posts_needing_classifier()),
            "news": len(news_needing_classifier()),
            "scripts": len(news_without_scripts()),
        })
    except Exception as error:
        return jsonify({"error": str(error)}), 500


# ============================================================
# ADMIN — NEWS SEARCH / EDIT / DELETE
# ============================================================

@app.route("/api/admin/news")
def admin_news():
    try:
        page = max(1, int(request.args.get("page", 1)))
        limit = min(50, max(1, int(request.args.get("limit", 20))))
        search = request.args.get("search", "").strip()
        source = request.args.get("source", "").strip()

        sb = get_supabase()
        query = sb.table("news").select("*").order("collected_at", desc=True)

        if search:
            query = query.ilike("title", f"%{search}%")

        if source:
            query = query.eq("source", source)

        # Fetch a bounded set for the admin panel, then attach script state.
        response = query.limit(500).execute()
        items = response.data or []

        scripts_response = sb.table("scripts").select("id, news_id, status").execute()
        script_rows = scripts_response.data or []
        scripts_by_news = {}
        for row in script_rows:
            news_id = row.get("news_id")
            if news_id is not None:
                scripts_by_news[news_id] = row

        for item in items:
            script = scripts_by_news.get(item.get("id"))
            item["has_script"] = script is not None
            item["script_id"] = script.get("id") if script else None
            item["script_status"] = script.get("status") if script else None

            classifier = item.get("classifier")
            item["has_classifier"] = bool(
                isinstance(classifier, str) and classifier.strip()
            )

        start = (page - 1) * limit
        end = start + limit

        return jsonify({
            "data": items[start:end],
            "page": page,
            "limit": limit,
            "total": len(items),
        })

    except ValueError:
        return jsonify({"error": "page and limit must be numbers"}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/admin/news/<int:news_id>", methods=["PUT"])
def admin_update_news(news_id):
    payload = request.get_json(silent=True) or {}

    title = payload.get("title")
    summary = payload.get("raw_content")
    classifier = payload.get("classifier")

    updates = {}

    if title is not None:
        title = str(title).strip()
        if not title:
            return jsonify({"error": "title cannot be empty"}), 400
        updates["title"] = title

    if summary is not None:
        updates["raw_content"] = str(summary).strip()

    if classifier is not None:
        updates["classifier"] = str(classifier).strip()

    if not updates:
        return jsonify({"error": "Nothing to update"}), 400

    try:
        sb = get_supabase()
        response = (
            sb.table("news")
            .update(updates)
            .eq("id", news_id)
            .execute()
        )

        if not response.data:
            return jsonify({"error": "News item not found"}), 404

        log_activity(f"✏️ News #{news_id} updated.")
        return jsonify({"success": True, "data": response.data[0]})

    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/admin/news/<int:news_id>", methods=["DELETE"])
def admin_delete_news(news_id):
    try:
        sb = get_supabase()

        article = _fetch_news_by_id(news_id)
        if not article:
            return jsonify({"error": "News item not found"}), 404

        # Delete scripts explicitly first, so this still works even if the
        # database foreign key is not configured with ON DELETE CASCADE.
        sb.table("scripts").delete().eq("news_id", news_id).execute()
        sb.table("news").delete().eq("id", news_id).execute()

        log_activity(
            f"🗑️ Deleted News #{news_id}: {article.get('title', 'Untitled')}"
        )

        return jsonify({
            "success": True,
            "deleted_id": news_id,
        })

    except Exception as error:
        return jsonify({"error": str(error)}), 500


# ============================================================
# ADMIN — STATS / ACTIVITY / SYSTEM
# ============================================================

@app.route("/api/admin/stats")
def admin_stats():
    try:
        sb = get_supabase()
        news = sb.table("news").select("id").execute()
        social = sb.table("monitored_posts").select("id").execute()
        scripts = sb.table("scripts").select("id").execute()

        return jsonify({
            "news": len(news.data or []),
            "social_posts": len(social.data or []),
            "scripts": len(scripts.data or []),
        })
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/admin/activity")
def admin_activity():
    refresh_finished_processes()
    try:
        limit = min(100, max(1, int(request.args.get("limit", 30))))
    except ValueError:
        limit = 30

    return jsonify({"data": list(activity_log)[:limit]})


@app.route("/api/admin/system")
def admin_system():
    refresh_finished_processes()
    return jsonify({
        "api": {
            "status": "online",
            "service": "leonida-forge-api",
        },
        "services": [service_status(service_id) for service_id in SERVICES],
        "script_job": get_script_job(),
        "activity": list(activity_log)[:20],
    })


# ============================================================
# START FLASK
# ============================================================

if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"

    print()
    print("======================================")
    print("       LEONIDA FORGE BACKEND")
    print("======================================")
    print(f"API: http://localhost:{PORT}")
    print("Workers: MANUAL / ADMIN CONTROLLED")
    print("X watcher: READY")
    print("Rockstar Newswire: READY")
    print("General News: READY")
    print("AI pipeline: READY (posts -> news -> scripts)")
    print("======================================")
    print()

    app.run(
        host="0.0.0.0",
        port=PORT,
        debug=debug,
        use_reloader=False,
    )