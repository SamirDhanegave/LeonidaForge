import json
import re
import time
from datetime import datetime
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from lib.supabase_client import supabase


NEWSWIRE_URL = "https://www.rockstargames.com/newswire"
CHECK_EVERY = 300  # 5 minutes

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/153.0.0.0 Safari/537.36"
    )
}


def fetch_html(url):
    response = requests.get(
        url,
        headers=HEADERS,
        timeout=30
    )

    response.raise_for_status()

    return response.text


def clean_text(text):
    if not text:
        return None

    return re.sub(
        r"\s+",
        " ",
        text
    ).strip()


def get_meta(soup, *, name=None, prop=None):
    if name:
        tag = soup.find("meta", attrs={"name": name})

    else:
        tag = soup.find("meta", attrs={"property": prop})

    if tag:
        return tag.get("content")

    return None


def extract_json_ld(soup):
    scripts = soup.find_all(
        "script",
        type="application/ld+json"
    )

    objects = []

    for script in scripts:

        try:
            data = json.loads(script.string or script.get_text())
        except (json.JSONDecodeError, TypeError):
            continue

        if isinstance(data, list):
            objects.extend(data)

        else:
            objects.append(data)

    return objects


def extract_published_date(soup):
    # Standard article metadata
    value = get_meta(
        soup,
        prop="article:published_time"
    )

    if value:
        return value

    # <time datetime="...">
    time_tag = soup.find("time")

    if time_tag:
        value = time_tag.get("datetime")

        if value:
            return value

    # JSON-LD
    for obj in extract_json_ld(soup):

        if isinstance(obj, dict):

            published = obj.get("datePublished")

            if published:
                return published

    return None


def extract_article(url):
    print(f"Fetching article: {url}")

    html = fetch_html(url)

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    # -----------------------------------
    # TITLE
    # -----------------------------------

    title = (
        get_meta(soup, prop="og:title")
        or get_meta(soup, name="twitter:title")
    )

    if not title:

        h1 = soup.find("h1")

        if h1:
            title = clean_text(
                h1.get_text(" ", strip=True)
            )

    if not title and soup.title:
        title = clean_text(soup.title.get_text())

    # -----------------------------------
    # IMAGE
    # -----------------------------------

    image_url = (
        get_meta(soup, prop="og:image")
        or get_meta(soup, name="twitter:image")
    )

    if image_url:
        image_url = urljoin(
            url,
            image_url
        )

    # -----------------------------------
    # DATE
    # -----------------------------------

    published_at = extract_published_date(soup)

    # -----------------------------------
    # RAW ARTICLE CONTENT
    # -----------------------------------

    article = soup.find("article")

    if article:

        raw_content = clean_text(
            article.get_text(" ", strip=True)
        )

    else:

        # Try likely content containers
        candidates = soup.find_all(
            ["main", "section", "div"]
        )

        content_candidates = []

        for candidate in candidates:

            classes = " ".join(
                candidate.get("class", [])
            ).lower()

            candidate_id = (
                candidate.get("id") or ""
            ).lower()

            combined = (
                classes + " " + candidate_id
            )

            if any(
                keyword in combined
                for keyword in [
                    "article",
                    "newswire",
                    "content",
                    "body"
                ]
            ):

                text = clean_text(
                    candidate.get_text(
                        " ",
                        strip=True
                    )
                )

                if text:
                    content_candidates.append(text)

        if content_candidates:

            raw_content = max(
                content_candidates,
                key=len
            )

        else:

            # Last fallback
            description = (
                get_meta(
                    soup,
                    prop="og:description"
                )
                or get_meta(
                    soup,
                    name="description"
                )
            )

            raw_content = clean_text(
                description
            )

    return {
        "title": title,
        "url": url,
        "raw_content": raw_content,
        "published_at": published_at,
        "image_url": image_url
    }


def get_news_links():
    print("Scanning Rockstar Newswire...")

    html = fetch_html(
        NEWSWIRE_URL
    )

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    links = set()

    for anchor in soup.find_all("a", href=True):

        href = anchor["href"]

        absolute_url = urljoin(
            NEWSWIRE_URL,
            href
        )

        # Rockstar Newswire article pattern
        if "/newswire/article/" in absolute_url:

            links.add(
                absolute_url.split("#")[0]
            )

    return links


def get_existing_urls():
    response = (
        supabase
        .table("news")
        .select("url")
        .eq(
            "source",
            "rockstar_newswire"
        )
        .execute()
    )

    return {
        row["url"]
        for row in response.data
        if row.get("url")
    }


def save_news(article):
    response = (
        supabase
        .table("news")
        .insert({
            "source": "rockstar_newswire",
            "title": article["title"],
            "url": article["url"],
            "raw_content": article["raw_content"],
            "published_at": article["published_at"],
            "image_url": article["image_url"],
            "classifier": None
        })
        .execute()
    )

    return response


def main():

    print("====================================")
    print("Rockstar Newswire Collector")
    print("====================================")

    # -----------------------------------
    # Establish baseline
    # -----------------------------------

    current_links = get_news_links()

    print(
        f"Found {len(current_links)} articles "
        "on the Newswire."
    )

    existing_urls = get_existing_urls()

    baseline_urls = (
        current_links
        | existing_urls
    )

    print(
        f"Baseline articles: "
        f"{len(baseline_urls)}"
    )

    print(
        "Now waiting for NEW Rockstar news..."
    )

    # -----------------------------------
    # Continuous monitoring
    # -----------------------------------

    while True:

        try:

            current_links = get_news_links()

            new_urls = (
                current_links - baseline_urls
            )

            if new_urls:

                print(
                    f"\nFound {len(new_urls)} "
                    "NEW article(s)!"
                )

                # Oldest first isn't guaranteed,
                # so sort for deterministic processing.
                for url in sorted(new_urls):

                    try:

                        article = extract_article(
                            url
                        )

                        print("\n==============================")
                        print("NEW NEWS")
                        print("==============================")

                        print(
                            f"Title: "
                            f"{article['title']}"
                        )

                        print(
                            f"URL: "
                            f"{article['url']}"
                        )

                        print(
                            f"Published: "
                            f"{article['published_at']}"
                        )

                        save_news(article)

                        print(
                            "✅ Saved to Supabase"
                        )

                        baseline_urls.add(
                            url
                        )

                    except Exception as error:

                        print(
                            f"❌ Failed to process "
                            f"{url}"
                        )

                        print(error)

            else:

                print(
                    "No new Rockstar news."
                )

        except Exception as error:

            print(
                "❌ Collector error:"
            )

            print(error)

        print(
            f"Waiting {CHECK_EVERY} seconds..."
        )

        time.sleep(
            CHECK_EVERY
        )


if __name__ == "__main__":
    main()