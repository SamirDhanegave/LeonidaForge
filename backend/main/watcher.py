from playwright.sync_api import sync_playwright
import time
import re

from lib.supabase_client import supabase


USERNAME = "SlothProtectr69"
CHECK_EVERY = 30  # seconds


def extract_post_id(url):
    match = re.search(r"/status/(\d+)", url)
    return match.group(1) if match else None


with sync_playwright() as p:

    browser = p.chromium.launch(
        channel="chrome",
        headless=False
    )

    page = browser.new_page()

    url = f"https://x.com/{USERNAME}"

    print(f"Opening {url}")

    page.goto(
        url,
        wait_until="domcontentloaded"
    )

    page.wait_for_timeout(5000)

    print("Page loaded.")
    print("Starting watcher...")

    # --------------------------------
    # Establish baseline
    # --------------------------------

    articles = page.locator("article")

    baseline_ids = set()

    for i in range(articles.count()):

        article = articles.nth(i)

        links = article.locator("a")

        for j in range(links.count()):

            href = links.nth(j).get_attribute("href")

            if href:

                post_id = extract_post_id(href)

                if post_id:
                    baseline_ids.add(post_id)

    print(f"Baseline posts: {len(baseline_ids)}")
    print("Now waiting for NEW posts...")

    # --------------------------------
    # Watch forever
    # --------------------------------

    while True:

        page.reload(
            wait_until="domcontentloaded"
        )

        page.wait_for_timeout(3000)

        articles = page.locator("article")

        for i in range(articles.count()):

            article = articles.nth(i)

            links = article.locator("a")

            post_id = None
            post_url = None

            for j in range(links.count()):

                href = links.nth(j).get_attribute("href")

                if href:

                    possible_id = extract_post_id(href)

                    if possible_id:

                        post_id = possible_id
                        post_url = "https://x.com" + href

                        break

            if not post_id:
                continue

            # Already seen during this run
            if post_id in baseline_ids:
                continue

            # --------------------------------
            # NEW POST DETECTED
            # --------------------------------

            text = article.inner_text()

            print("\n==============================")
            print("NEW POST DETECTED!")
            print("==============================")

            print(f"Username: {USERNAME}")
            print(f"Post ID: {post_id}")
            print(f"URL: {post_url}")
            print(f"Text:\n{text}")

            # --------------------------------
            # Save to Supabase
            # --------------------------------

            response = supabase.table(
                "monitored_posts"
            ).insert({
                "agent": "x_watcher_01",
                "classifier": None,
                "username": USERNAME,
                "post_id": post_id,
                "raw_script": text
            }).execute()

            print("✅ Saved to Supabase!")

            # Remember it
            baseline_ids.add(post_id)

        print("Checked. Waiting...")

        time.sleep(CHECK_EVERY)