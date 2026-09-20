

from lib.llm import ask_openrouter
from lib.supabase_client import supabase


# ============================================================
# CONFIG
# ============================================================

POSTS_TABLE = "monitored_posts"
NEWS_TABLE = "news"
SCRIPTS_TABLE = "scripts"

# Column names — change these here if your schema uses different ones.
POST_SOURCE_FIELD = "raw_script"
NEWS_SOURCE_FIELD = "raw_content"
CLASSIFIER_FIELD = "classifier"

# How many rows to pull per table in one pass.
FETCH_LIMIT = 500


# ============================================================
# HELPERS
# ============================================================

def _has_text(value):
    """True only for a non-empty, non-whitespace string."""
    return isinstance(value, str) and value.strip() != ""


def _clean(value):
    return value.strip() if isinstance(value, str) else ""


def _emit(on_log, message):
    print(message, flush=True)
    if on_log:
        try:
            on_log(message)
        except Exception:
            pass


def _report(on_progress, **fields):
    if on_progress:
        try:
            on_progress(**fields)
        except Exception:
            pass


def _reference_text(news):
    """Prefer the written classifier, fall back to the scraped content."""
    classifier = news.get(CLASSIFIER_FIELD)
    if _has_text(classifier):
        return _clean(classifier)
    return _clean(news.get(NEWS_SOURCE_FIELD))


# ============================================================
# PROMPTS
# ============================================================

def write_post_article(post):
    """Stage 1 — turn a monitored X post into a human-sounding write-up."""
    prompt = f"""
You are a gaming news writer covering GTA VI.

Below is a post from X (Twitter) that was picked up by a monitoring tool.
Write a short article about it, the way a real person would write it.

AUTHOR:
{_clean(post.get("username")) or _clean(post.get("author")) or "Unknown"}

POST:
{_clean(post.get(POST_SOURCE_FIELD))}

Requirements:
- Write in natural human language. No AI phrasing, no filler, no hype words.
- Explain what the post actually says and why it matters to GTA fans.
- Stick strictly to what is in the post. Do not invent details, dates or numbers.
- If the post is speculation or a rumour, say so plainly.
- 120-200 words. Plain text, no headings, no markdown, no hashtags.

Return only the article text.
"""
    return ask_openrouter(prompt)


def write_news_article(news):
    """Stage 2 — rewrite scraped news content in a human voice."""
    prompt = f"""
You are a gaming news writer covering GTA VI.

Below is a scraped news article. Rewrite it in your own words, the way a real
person would write it for readers.

TITLE:
{_clean(news.get("title"))}

SOURCE ARTICLE:
{_clean(news.get(NEWS_SOURCE_FIELD))}

Requirements:
- Write in natural human language. No AI phrasing, no filler, no hype words.
- Keep every important fact from the source article.
- Do not invent information that is not in the source.
- Keep it clear and readable for a general gaming audience.
- 150-250 words. Plain text, no headings, no markdown.

Return only the article text.
"""
    return ask_openrouter(prompt)


def generate_youtube_script(news):
    """Stage 3 — YouTube script."""
    prompt = f"""
You are a gaming news content writer.

Create a YouTube video script about this GTA news.

TITLE:
{_clean(news.get("title"))}

ARTICLE:
{_reference_text(news)}

Requirements:
- Start with a strong factual hook.
- Explain what happened clearly.
- Include the important details.
- Do not invent information.
- Keep the tone natural and suitable for a gaming YouTube channel.
- Make it easy for a content creator to read.
- End with a short conclusion.

Return only the script.
"""
    return ask_openrouter(prompt)


def generate_instagram_script(news):
    """Stage 3 — Instagram / Reel script."""
    prompt = f"""
You are a gaming social-media content writer.

Create a short Instagram/Reel script about this GTA news.

TITLE:
{_clean(news.get("title"))}

ARTICLE:
{_reference_text(news)}

Requirements:
- Hook the viewer immediately.
- Keep it short and engaging.
- Explain the important information clearly.
- Do not invent information.
- Make it suitable for a short-form gaming video.
- Use natural spoken language.

Return only the script.
"""
    return ask_openrouter(prompt)


# ============================================================
# DATABASE
# ============================================================

def _save_post_classifier(post_id, text):
    return (
        supabase
        .table(POSTS_TABLE)
        .update({CLASSIFIER_FIELD: text})
        .eq("id", post_id)
        .execute()
    )


def _save_news_classifier(news_id, text):
    return (
        supabase
        .table(NEWS_TABLE)
        .update({CLASSIFIER_FIELD: text})
        .eq("id", news_id)
        .execute()
    )


def save_scripts(news_id, youtube_script, instagram_script):
    return (
        supabase
        .table(SCRIPTS_TABLE)
        .insert({
            "news_id": news_id,
            "youtube_script": youtube_script,
            "instagram_script": instagram_script,
        })
        .execute()
    )


def _fetch_posts(limit=FETCH_LIMIT):
    response = (
        supabase
        .table(POSTS_TABLE)
        .select("*")
        .order("date", desc=True)
        .limit(limit)
        .execute()
    )
    return response.data or []


def _fetch_news(limit=FETCH_LIMIT):
    response = (
        supabase
        .table(NEWS_TABLE)
        .select("*")
        .order("collected_at", desc=True)
        .limit(limit)
        .execute()
    )
    return response.data or []


def fetch_news_by_id(news_id):
    response = (
        supabase
        .table(NEWS_TABLE)
        .select("*")
        .eq("id", news_id)
        .maybe_single()
        .execute()
    )
    return response.data


def _fetch_generated_news_ids():
    response = (
        supabase
        .table(SCRIPTS_TABLE)
        .select("news_id")
        .execute()
    )
    return {
        row.get("news_id")
        for row in (response.data or [])
        if row.get("news_id") is not None
    }


def _delete_scripts_for(news_id):
    return (
        supabase
        .table(SCRIPTS_TABLE)
        .delete()
        .eq("news_id", news_id)
        .execute()
    )


# ============================================================
# STAGE 1 — monitored_posts -> classifier
# ============================================================

def posts_needing_classifier(force=False):
    return [
        post
        for post in _fetch_posts()
        if _has_text(post.get(POST_SOURCE_FIELD))
        and (force or not _has_text(post.get(CLASSIFIER_FIELD)))
    ]


def process_monitored_posts(force=False, on_log=None, on_progress=None):
    queue = posts_needing_classifier(force=force)
    total = len(queue)

    _report(on_progress, stage="posts", total=total, processed=0)

    if not total:
        _emit(on_log, "ℹ️ Stage 1: no X posts waiting to be written.")
        return {"total": 0, "done": 0, "errors": []}

    _emit(on_log, f"📝 Stage 1: writing {total} X post(s).")

    done = 0
    errors = []

    for index, post in enumerate(queue, start=1):
        post_id = post.get("id")

        _report(
            on_progress,
            stage="posts",
            total=total,
            processed=index - 1,
            current_news_id=post_id,
            current_title=f"X post #{post_id}",
        )

        try:
            text = _clean(write_post_article(post))

            if not text:
                raise ValueError("model returned empty text")

            _save_post_classifier(post_id, text)
            done += 1
            _emit(on_log, f"✅ Stage 1: post #{post_id} written.")

        except Exception as error:
            message = f"post #{post_id}: {error}"
            errors.append(message)
            _emit(on_log, f"⚠️ Stage 1 failed for {message}")

        _report(on_progress, stage="posts", total=total, processed=index)

    return {"total": total, "done": done, "errors": errors}


# ============================================================
# STAGE 2 — news.raw_content -> news.classifier
# ============================================================

def news_needing_classifier(force=False, news_id=None):
    if news_id is not None:
        article = fetch_news_by_id(news_id)
        rows = [article] if article else []
    else:
        rows = _fetch_news()

    return [
        news
        for news in rows
        if _has_text(news.get(NEWS_SOURCE_FIELD))
        and (force or not _has_text(news.get(CLASSIFIER_FIELD)))
    ]


def process_news_classifiers(force=False, news_id=None, on_log=None, on_progress=None):
    queue = news_needing_classifier(force=force, news_id=news_id)
    total = len(queue)

    _report(on_progress, stage="news", total=total, processed=0)

    if not total:
        _emit(on_log, "ℹ️ Stage 2: no news articles waiting to be written.")
        return {"total": 0, "done": 0, "errors": []}

    _emit(on_log, f"📝 Stage 2: writing {total} news article(s).")

    done = 0
    errors = []

    for index, news in enumerate(queue, start=1):
        current_id = news.get("id")
        title = _clean(news.get("title")) or f"News #{current_id}"

        _report(
            on_progress,
            stage="news",
            total=total,
            processed=index - 1,
            current_news_id=current_id,
            current_title=title,
        )

        try:
            text = _clean(write_news_article(news))

            if not text:
                raise ValueError("model returned empty text")

            _save_news_classifier(current_id, text)
            news[CLASSIFIER_FIELD] = text
            done += 1
            _emit(on_log, f"✅ Stage 2: News #{current_id} written.")

        except Exception as error:
            message = f"News #{current_id}: {error}"
            errors.append(message)
            _emit(on_log, f"⚠️ Stage 2 failed for {message}")

        _report(on_progress, stage="news", total=total, processed=index)

    return {"total": total, "done": done, "errors": errors}


# ============================================================
# STAGE 3 — news without scripts -> scripts
# ============================================================

def news_without_scripts(news_id=None, force=False):
    """News rows whose id does not appear as scripts.news_id."""
    if news_id is not None:
        article = fetch_news_by_id(news_id)
        if not article:
            return []
        rows = [article]
    else:
        rows = _fetch_news()

    if force:
        return rows

    generated = _fetch_generated_news_ids()

    return [
        news
        for news in rows
        if news.get("id") is not None and news.get("id") not in generated
    ]


def generate_content(news, force=False):
    """Generate and store both scripts for one news row."""
    news_id = news.get("id")

    youtube_script = generate_youtube_script(news)
    instagram_script = generate_instagram_script(news)

    if force and news_id is not None:
        _delete_scripts_for(news_id)

    save_scripts(
        news_id=news_id,
        youtube_script=youtube_script,
        instagram_script=instagram_script,
    )

    return {
        "youtube_script": youtube_script,
        "instagram_script": instagram_script,
    }


def process_scripts(force=False, news_id=None, on_log=None, on_progress=None):
    queue = news_without_scripts(news_id=news_id, force=force)
    total = len(queue)

    _report(on_progress, stage="scripts", total=total, processed=0)

    if not total:
        _emit(on_log, "ℹ️ Stage 3: every news article already has scripts.")
        return {"total": 0, "done": 0, "errors": []}

    _emit(on_log, f"🤖 Stage 3: generating scripts for {total} article(s).")

    done = 0
    errors = []

    for index, news in enumerate(queue, start=1):
        current_id = news.get("id")
        title = _clean(news.get("title")) or f"News #{current_id}"

        _report(
            on_progress,
            stage="scripts",
            total=total,
            processed=index - 1,
            current_news_id=current_id,
            current_title=title,
        )

        try:
            generate_content(news, force=force)
            done += 1
            _emit(on_log, f"✅ Stage 3: scripts generated for News #{current_id}.")

        except Exception as error:
            message = f"News #{current_id}: {error}"
            errors.append(message)
            _emit(on_log, f"⚠️ Stage 3 failed for {message}")

        _report(on_progress, stage="scripts", total=total, processed=index)

    return {"total": total, "done": done, "errors": errors}


# ============================================================
# PIPELINE
# ============================================================

def run_pipeline(news_id=None, force=False, on_log=None, on_progress=None):
    """
    Run all three stages in order.

    news_id : restrict stages 2 and 3 to a single news row. Stage 1 is skipped,
              since monitored posts are unrelated to a specific news id.
    force   : rewrite rows that already have a classifier, and regenerate
              scripts that already exist.
    """
    summary = {
        "posts": {"total": 0, "done": 0, "errors": []},
        "news": {"total": 0, "done": 0, "errors": []},
        "scripts": {"total": 0, "done": 0, "errors": []},
    }

    if news_id is None:
        summary["posts"] = process_monitored_posts(
            force=force,
            on_log=on_log,
            on_progress=on_progress,
        )
    else:
        _emit(on_log, f"ℹ️ Single-article run for News #{news_id}; skipping X posts.")

    summary["news"] = process_news_classifiers(
        force=force,
        news_id=news_id,
        on_log=on_log,
        on_progress=on_progress,
    )

    summary["scripts"] = process_scripts(
        force=force,
        news_id=news_id,
        on_log=on_log,
        on_progress=on_progress,
    )

    summary["posts_classified"] = summary["posts"]["done"]
    summary["news_classified"] = summary["news"]["done"]
    summary["scripts_generated"] = summary["scripts"]["done"]
    summary["errors"] = (
        summary["posts"]["errors"]
        + summary["news"]["errors"]
        + summary["scripts"]["errors"]
    )

    _emit(
        on_log,
        "📊 Pipeline summary — "
        f"posts written: {summary['posts_classified']}, "
        f"news written: {summary['news_classified']}, "
        f"scripts generated: {summary['scripts_generated']}, "
        f"errors: {len(summary['errors'])}",
    )

    return summary


# ============================================================
# CLI
# ============================================================

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Run the AI content pipeline.")
    parser.add_argument("--news-id", type=int, default=None,
                        help="Only process this news id (skips X posts).")
    parser.add_argument("--force", action="store_true",
                        help="Rewrite classifiers and regenerate existing scripts.")
    args = parser.parse_args()

    run_pipeline(news_id=args.news_id, force=args.force)