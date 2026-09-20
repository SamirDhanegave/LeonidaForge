"""
general_news.py

General GTA VI news collector.

This is SEPARATE from main/news.py.

Pipeline:

RSS / Google News / Wikipedia
        ↓
collect recent GTA VI articles
        ↓
scrape article page
        ↓
summarize with LLM
        ↓
save summary to Supabase `news`

Expected existing files:

    lib/llm.py
    lib/supabase_client.py

Expected Supabase `news` columns:

    id
    source
    title
    url
    raw_content
    image_url
    classifier

IMPORTANT:
This script does NOT check whether a URL already exists in Supabase.
Every run processes the articles it finds.
"""

import html
import re
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from urllib.parse import quote, urljoin

import requests
from bs4 import BeautifulSoup

from lib.llm import ask_openrouter
from lib.supabase_client import supabase


# ============================================================
# CONFIG
# ============================================================

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/153.0.0.0 Safari/537.36"
    )
}

RECENT_HOURS = 72

MAX_ARTICLES_PER_FEED = 10
MAX_GOOGLE_RESULTS_PER_QUERY = 10
MAX_WIKIPEDIA_RESULTS = 10

MIN_ARTICLE_LENGTH = 300
MAX_ARTICLE_LENGTH = 30000


# ============================================================
# RSS FEEDS
# ============================================================

RSS_FEEDS = [
    {
        "name": "Google News - GTA VI",
        "url": (
            "https://news.google.com/rss/search?"
            "q=GTA+VI&hl=en-US&gl=US&ceid=US:en"
        ),
    },
    {
        "name": "Google News - GTA 6",
        "url": (
            "https://news.google.com/rss/search?"
            "q=GTA+6&hl=en-US&gl=US&ceid=US:en"
        ),
    },
    {
        "name": "Google News - Grand Theft Auto VI",
        "url": (
            "https://news.google.com/rss/search?"
            "q=%22Grand+Theft+Auto+VI%22"
            "&hl=en-US&gl=US&ceid=US:en"
        ),
    },
]


# Extra Google News searches
GOOGLE_QUERIES = [
    "GTA VI",
    "GTA 6",
    "Grand Theft Auto VI",
    "GTA VI Rockstar",
    "GTA VI trailer",
    "GTA VI release date",
]


WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"


# ============================================================
# HELPERS
# ============================================================

def clean_text(text: str) -> str:
    """Clean and normalize extracted text."""

    text = html.unescape(text or "")
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def is_recent(date_value) -> bool:
    """Return True if an article date is within RECENT_HOURS."""

    if not date_value:
        return True

    try:
        if date_value.tzinfo is None:
            date_value = date_value.replace(tzinfo=timezone.utc)

        cutoff = datetime.now(timezone.utc) - timedelta(
            hours=RECENT_HOURS
        )

        return date_value >= cutoff

    except Exception:
        return True


def absolute_url(base_url: str, url: str) -> str:
    """Turn relative URLs into absolute URLs."""

    if not url:
        return ""

    return urljoin(base_url, url)


# ============================================================
# RSS
# ============================================================

def fetch_rss(feed_url: str, feed_name: str):
    """Fetch one RSS feed and return article metadata."""

    print(f"\n[RSS] Reading: {feed_name}")

    try:
        response = requests.get(
            feed_url,
            headers=HEADERS,
            timeout=20,
        )

        response.raise_for_status()

        soup = BeautifulSoup(
            response.content,
            "xml",
        )

        items = soup.find_all("item")

        articles = []

        for item in items[:MAX_ARTICLES_PER_FEED]:

            title_tag = item.find("title")
            link_tag = item.find("link")

            if not title_tag or not link_tag:
                continue

            title = clean_text(
                title_tag.get_text(" ", strip=True)
            )

            url = link_tag.get_text(
                strip=True
            )

            if not title or not url:
                continue

            published_at = None

            pub_tag = item.find("pubDate")

            if pub_tag:
                try:
                    published_at = parsedate_to_datetime(
                        pub_tag.get_text(strip=True)
                    )
                except Exception:
                    published_at = None

            if not is_recent(published_at):
                continue

            source_tag = item.find("source")

            article_source = (
                clean_text(
                    source_tag.get_text(" ", strip=True)
                )
                if source_tag
                else feed_name
            )

            articles.append({
                "title": title,
                "url": url,
                "source": article_source,
                "published_at": published_at,
            })

        print(
            f"[RSS] Found {len(articles)} recent articles."
        )

        return articles

    except Exception as exc:
        print(
            f"[RSS] Failed {feed_name}: {exc}"
        )

        return []


def collect_rss_articles():
    """Collect articles from all configured RSS feeds."""

    all_articles = []

    for feed in RSS_FEEDS:

        articles = fetch_rss(
            feed["url"],
            feed["name"],
        )

        all_articles.extend(articles)

    return all_articles


# ============================================================
# GOOGLE NEWS
# ============================================================

def search_google_news(query: str):
    """Search Google News RSS for one query."""

    url = (
        "https://news.google.com/rss/search?"
        f"q={quote(query)}"
        "&hl=en-US"
        "&gl=US"
        "&ceid=US:en"
    )

    print(
        f"\n[GOOGLE NEWS] Searching: {query}"
    )

    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=20,
        )

        response.raise_for_status()

        soup = BeautifulSoup(
            response.content,
            "xml",
        )

        results = []

        for item in soup.find_all("item")[
            :MAX_GOOGLE_RESULTS_PER_QUERY
        ]:

            title_tag = item.find("title")
            link_tag = item.find("link")

            if not title_tag or not link_tag:
                continue

            title = clean_text(
                title_tag.get_text(
                    " ",
                    strip=True,
                )
            )

            url = link_tag.get_text(
                strip=True
            )

            if not title or not url:
                continue

            published_at = None

            pub_tag = item.find("pubDate")

            if pub_tag:
                try:
                    published_at = parsedate_to_datetime(
                        pub_tag.get_text(strip=True)
                    )
                except Exception:
                    published_at = None

            if not is_recent(published_at):
                continue

            source_tag = item.find("source")

            source = (
                clean_text(
                    source_tag.get_text(
                        " ",
                        strip=True,
                    )
                )
                if source_tag
                else "Google News"
            )

            results.append({
                "title": title,
                "url": url,
                "source": source,
                "published_at": published_at,
            })

        print(
            f"[GOOGLE NEWS] Found {len(results)} results."
        )

        return results

    except Exception as exc:
        print(
            f"[GOOGLE NEWS] Failed: {exc}"
        )

        return []


def collect_google_news():
    """Run several GTA VI Google News searches."""

    all_results = []

    for query in GOOGLE_QUERIES:

        results = search_google_news(
            query
        )

        all_results.extend(results)

    return all_results


# ============================================================
# WIKIPEDIA
# ============================================================

def search_wikipedia():
    """
    Search Wikipedia for GTA VI related pages.

    Wikipedia is supplemental information, not necessarily
    breaking news.
    """

    print("\n[WIKIPEDIA] Searching...")

    params = {
        "action": "query",
        "format": "json",
        "list": "search",
        "srsearch": (
            "GTA VI OR GTA 6 "
            "OR Grand Theft Auto VI"
        ),
        "srnamespace": 0,
        "srlimit": MAX_WIKIPEDIA_RESULTS,
    }

    try:

        response = requests.get(
            WIKIPEDIA_API,
            params=params,
            headers=HEADERS,
            timeout=20,
        )

        response.raise_for_status()

        data = response.json()

        results = []

        search_results = (
            data
            .get("query", {})
            .get("search", [])
        )

        for item in search_results:

            title = item.get(
                "title",
                "",
            ).strip()

            if not title:
                continue

            url = (
                "https://en.wikipedia.org/wiki/"
                + quote(
                    title.replace(
                        " ",
                        "_",
                    )
                )
            )

            results.append({
                "title": title,
                "url": url,
                "source": "Wikipedia",
                "published_at": None,
            })

        print(
            f"[WIKIPEDIA] Found {len(results)} pages."
        )

        return results

    except Exception as exc:

        print(
            f"[WIKIPEDIA] Failed: {exc}"
        )

        return []


# ============================================================
# ARTICLE SCRAPER
# ============================================================

def extract_image(soup: BeautifulSoup, page_url: str):
    """Try common locations for article images."""

    # OpenGraph
    og_image = soup.find(
        "meta",
        attrs={
            "property": "og:image"
        },
    )

    if og_image:

        content = og_image.get(
            "content"
        )

        if content:
            return absolute_url(
                page_url,
                content,
            )

    # Twitter image
    twitter_image = soup.find(
        "meta",
        attrs={
            "name": "twitter:image"
        },
    )

    if twitter_image:

        content = twitter_image.get(
            "content"
        )

        if content:
            return absolute_url(
                page_url,
                content,
            )

    return None


def scrape_article(url: str):
    """
    Fetch an article page and extract readable text
    plus a possible image.
    """

    print(
        f"[SCRAPE] {url}"
    )

    response = requests.get(
        url,
        headers=HEADERS,
        timeout=25,
    )

    response.raise_for_status()

    soup = BeautifulSoup(
        response.text,
        "html.parser",
    )

    image_url = extract_image(
        soup,
        url,
    )

    # Remove elements that aren't useful article content.
    for tag in soup([
        "script",
        "style",
        "noscript",
        "nav",
        "footer",
        "header",
        "aside",
        "form",
        "svg",
    ]):

        tag.decompose()

    paragraphs = []

    for element in soup.find_all(
        [
            "p",
            "h1",
            "h2",
            "h3",
        ]
    ):

        text = clean_text(
            element.get_text(
                " ",
                strip=True,
            )
        )

        if len(text) >= 40:
            paragraphs.append(text)

    article_text = "\n\n".join(
        paragraphs
    )

    article_text = article_text[
        :MAX_ARTICLE_LENGTH
    ]

    if len(article_text) < MIN_ARTICLE_LENGTH:
        return None, image_url

    return article_text, image_url


# ============================================================
# AI SUMMARY
# ============================================================

def summarize_article(
    title: str,
    source: str,
    content: str,
):
    """
    Turn scraped source material into the content
    that is stored in news.raw_content.
    """

    prompt = f"""
You are a GTA VI gaming news editor for Leonida Forge.

SOURCE:
{source}

ARTICLE TITLE:
{title}

ARTICLE CONTENT:
{content}

Write a concise factual news summary.

Rules:
- Use only information supported by the supplied article.
- Do not invent facts.
- Do not add information from your own knowledge.
- If the article contains rumors or speculation,
  clearly describe them as unconfirmed.
- Do not copy the article word-for-word.
- Rewrite it naturally.
- Keep important facts.
- Do not mention scraping.
- Do not mention this prompt.
- Do not mention that you are an AI.
- Do not use Markdown.
- Return only the final summary.
"""

    summary = ask_openrouter(
        prompt,
        system_prompt=(
            "You are a factual GTA VI gaming news editor. "
            "Never invent information."
        ),
    )

    return summary.strip()


# ============================================================
# SUPABASE
# ============================================================

def save_to_supabase(
    article,
    summary,
    image_url,
):
    """
    Save only the summarized content.

    The original scraped article is NOT stored.
    """

    row = {
        "source": article["source"],
        "title": article["title"],
        "url": article["url"],
        "raw_content": summary,
        "image_url": image_url,
        "classifier": "gta6_news",
    }

    result = (
        supabase
        .table("news")
        .insert(row)
        .execute()
    )

    return result.data


# ============================================================
# PROCESS ONE ARTICLE
# ============================================================

def process_article(article):
    """Scrape -> summarize -> save one article."""

    print(
        "\n----------------------------------------"
    )

    print(
        f"[ARTICLE] {article['title']}"
    )

    try:

        content, image_url = scrape_article(
            article["url"]
        )

        if not content:

            print(
                "[ARTICLE] Could not extract enough text."
            )

            return False

        print(
            "[ARTICLE] Sending to LLM..."
        )

        summary = summarize_article(
            title=article["title"],
            source=article["source"],
            content=content,
        )

        if not summary:

            print(
                "[ARTICLE] Empty summary."
            )

            return False

        save_to_supabase(
            article=article,
            summary=summary,
            image_url=image_url,
        )

        print(
            "[ARTICLE] Saved to Supabase."
        )

        return True

    except Exception as exc:

        print(
            f"[ARTICLE] Failed: {exc}"
        )

        return False


# ============================================================
# REMOVE EXACT DUPLICATE RESULTS IN MEMORY
# ============================================================

def deduplicate_articles(articles):
    """
    Avoid processing the same URL multiple times when
    the same article appears in several RSS feeds/searches.

    This is ONLY in-memory deduplication for the current run.
    It does NOT query Supabase.
    """

    unique = {}
    seen_titles = set()

    for article in articles:

        url = article.get(
            "url",
            "",
        ).strip()

        title = article.get(
            "title",
            "",
        ).strip()

        if not url:
            continue

        if url in unique:
            continue

        # Some feeds can produce identical title entries
        # with slightly different redirect URLs.
        normalized_title = re.sub(
            r"[^a-z0-9]+",
            " ",
            title.lower(),
        ).strip()

        if normalized_title in seen_titles:
            continue

        unique[url] = article
        seen_titles.add(
            normalized_title
        )

    return list(
        unique.values()
    )


# ============================================================
# MAIN COLLECTION
# ============================================================

def collect_all():
    """Collect and process a batch of GTA VI content."""

    print(
        "\n========================================"
    )

    print(
        "Leonida Forge General News Collector"
    )

    print(
        "========================================"
    )

    # RSS
    rss_articles = collect_rss_articles()

    # Google News
    google_articles = collect_google_news()

    # Wikipedia
    wikipedia_articles = search_wikipedia()

    all_articles = (
        rss_articles
        + google_articles
        + wikipedia_articles
    )

    print(
        f"\n[MAIN] Raw results: "
        f"{len(all_articles)}"
    )

    # Deduplicate only for this run.
    articles = deduplicate_articles(
        all_articles
    )

    print(
        f"[MAIN] After in-memory deduplication: "
        f"{len(articles)}"
    )

    successful = 0
    failed = 0

    for article in articles:

        success = process_article(
            article
        )

        if success:
            successful += 1
        else:
            failed += 1

    print(
        "\n========================================"
    )

    print(
        f"Finished. Saved: {successful} | "
        f"Failed: {failed}"
    )

    print(
        "========================================\n"
    )


if __name__ == "__main__":
    collect_all()