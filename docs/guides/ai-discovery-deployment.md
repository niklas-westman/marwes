# AI discovery deployment runbook

This runbook manually deploys the dashboard AI discovery surface and the React,
Vue, and Svelte Storybooks. Run commands from the repository root. This process
is intentionally not automated and does not backfill historical Storybook
versions.

## Production targets

These values were verified against the current AWS account. Reconfirm them in
AWS before every deployment.

| Site | S3 bucket | CloudFront distribution |
| --- | --- | --- |
| `https://marwes.io` | `marwes-public-site-633877440512` | `E19J1RR810BP5V` |
| `https://storybook-react.marwes.io` | `marwes-storybook-react-633877440512` | `E3FMXRQSPW2G7Q` |
| `https://storybook-vue.marwes.io` | `marwes-storybook-vue-633877440512` | `E306XVIKBEFP36` |
| `https://storybook-svelte.marwes.io` | `marwes-storybook-svelte-633877440512` | `E1CCUBUVJBZ3SE` |

Prerequisites:

- `pnpm`, AWS CLI v2, `curl`, `jq`, and `rg`
- AWS credentials for account `633877440512`
- permission to write these buckets and create CloudFront invalidations
- an explicit new Storybook release version, without a leading `v`

```bash
export DASHBOARD_BUCKET="marwes-public-site-633877440512"
export DASHBOARD_DISTRIBUTION_ID="E19J1RR810BP5V"
export STORYBOOK_VERSION="1.3.1"

aws sts get-caller-identity --query Account --output text
test "$DASHBOARD_BUCKET" = "marwes-public-site-633877440512"
test -n "$STORYBOOK_VERSION"
test "$STORYBOOK_VERSION" != "latest"
```

The account command must print `633877440512`. Stop if any guard fails.

## Build and validate

Generate and check the committed discovery files before building. The dashboard
build also runs the AI publication check.

```bash
pnpm consumer-docs:generate
pnpm docs:consumer-check
pnpm --filter dashboard-teaser test

pnpm storybook:crawl-policy:check
pnpm site:crawlability:build-check
```

A successful crawlability check confirms these deploy inputs:

```text
apps/dashboard-teaser/dist/
  404.html
  robots.txt
  sitemap.xml
  llms.txt
  ai/index.json
  ai/{react,vue,svelte}.md
  ai/v1/*.json
  docs/**/index.html

apps/storybook-{react,vue,svelte}/storybook-static/
  index.html
  iframe.html
  robots.txt
```

## Cache and content-type policy

| Objects | `Content-Type` | `Cache-Control` |
| --- | --- | --- |
| Dashboard HTML and discovery files | explicit below | `public,max-age=300,must-revalidate` |
| Dashboard hashed `/assets/**` | inferred by AWS CLI | `public,max-age=31536000,immutable` |
| All Storybook `/latest/**` objects | inferred by AWS CLI | `public,max-age=300,must-revalidate` |
| Versioned Storybook `/<version>/**` | inferred by AWS CLI | `public,max-age=31536000,immutable` |
| Storybook root `robots.txt` | `text/plain; charset=utf-8` | `public,max-age=300,must-revalidate` |

Use `text/html; charset=utf-8` for HTML, `text/plain; charset=utf-8` for
`.txt` and `.md`, `application/xml` for `.xml`, and `application/json` for
`.json`.

## Deploy the dashboard

Preview the destructive sync and review every deletion:

```bash
aws s3 sync apps/dashboard-teaser/dist/ \
  "s3://$DASHBOARD_BUCKET/" \
  --delete \
  --dryrun \
  --cache-control "public,max-age=300,must-revalidate"
```

Never run `--delete` until the account and exact-bucket guards pass. This is a
dedicated dashboard bucket; do not substitute a shared bucket or an unresolved
variable.

```bash
aws s3 sync apps/dashboard-teaser/dist/ \
  "s3://$DASHBOARD_BUCKET/" \
  --delete \
  --cache-control "public,max-age=300,must-revalidate"

aws s3 cp apps/dashboard-teaser/dist/assets/ \
  "s3://$DASHBOARD_BUCKET/assets/" \
  --recursive \
  --cache-control "public,max-age=31536000,immutable"

aws s3 cp apps/dashboard-teaser/dist/index.html "s3://$DASHBOARD_BUCKET/index.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public,max-age=300,must-revalidate"
aws s3 cp apps/dashboard-teaser/dist/404.html "s3://$DASHBOARD_BUCKET/404.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public,max-age=300,must-revalidate"
aws s3 cp apps/dashboard-teaser/dist/docs/ "s3://$DASHBOARD_BUCKET/docs/" \
  --recursive \
  --exclude "*" \
  --include "*.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public,max-age=300,must-revalidate"
aws s3 cp apps/dashboard-teaser/dist/robots.txt "s3://$DASHBOARD_BUCKET/robots.txt" \
  --content-type "text/plain; charset=utf-8" \
  --cache-control "public,max-age=300,must-revalidate"
aws s3 cp apps/dashboard-teaser/dist/sitemap.xml "s3://$DASHBOARD_BUCKET/sitemap.xml" \
  --content-type "application/xml" \
  --cache-control "public,max-age=300,must-revalidate"
aws s3 cp apps/dashboard-teaser/dist/llms.txt "s3://$DASHBOARD_BUCKET/llms.txt" \
  --content-type "text/plain; charset=utf-8" \
  --cache-control "public,max-age=300,must-revalidate"
aws s3 cp apps/dashboard-teaser/dist/ai/index.json "s3://$DASHBOARD_BUCKET/ai/index.json" \
  --content-type "application/json" \
  --cache-control "public,max-age=300,must-revalidate"
aws s3 cp apps/dashboard-teaser/dist/ai/ "s3://$DASHBOARD_BUCKET/ai/" \
  --recursive \
  --exclude "*" \
  --include "*.md" \
  --content-type "text/plain; charset=utf-8" \
  --cache-control "public,max-age=300,must-revalidate"
aws s3 cp apps/dashboard-teaser/dist/ai/v1/ "s3://$DASHBOARD_BUCKET/ai/v1/" \
  --recursive \
  --content-type "application/json" \
  --cache-control "public,max-age=300,must-revalidate"
```

## Deploy each Storybook

Run this section separately for React, Vue, and Svelte. Select exactly one
verified target before each run:

```bash
# React
export STORYBOOK_FRAMEWORK="react"
export STORYBOOK_BUCKET="marwes-storybook-react-633877440512"
export STORYBOOK_DISTRIBUTION_ID="E3FMXRQSPW2G7Q"
export STORYBOOK_ORIGIN="https://storybook-react.marwes.io"
test "$STORYBOOK_BUCKET" = "marwes-storybook-react-633877440512"
```

```bash
# Vue
export STORYBOOK_FRAMEWORK="vue"
export STORYBOOK_BUCKET="marwes-storybook-vue-633877440512"
export STORYBOOK_DISTRIBUTION_ID="E306XVIKBEFP36"
export STORYBOOK_ORIGIN="https://storybook-vue.marwes.io"
test "$STORYBOOK_BUCKET" = "marwes-storybook-vue-633877440512"
```

```bash
# Svelte
export STORYBOOK_FRAMEWORK="svelte"
export STORYBOOK_BUCKET="marwes-storybook-svelte-633877440512"
export STORYBOOK_DISTRIBUTION_ID="E1CCUBUVJBZ3SE"
export STORYBOOK_ORIGIN="https://storybook-svelte.marwes.io"
test "$STORYBOOK_BUCKET" = "marwes-storybook-svelte-633877440512"
```

Confirm that the immutable version prefix is empty:

```bash
aws s3api list-objects-v2 \
  --bucket "$STORYBOOK_BUCKET" \
  --prefix "$STORYBOOK_VERSION/" \
  --max-keys 1 \
  --query KeyCount \
  --output text
```

The expected result is `0`. Stop if it is not `0`; never overwrite an existing
release. Preview both uploads:

```bash
aws s3 sync "apps/storybook-$STORYBOOK_FRAMEWORK/storybook-static/" \
  "s3://$STORYBOOK_BUCKET/$STORYBOOK_VERSION/" \
  --dryrun \
  --cache-control "public,max-age=31536000,immutable"

aws s3 sync "apps/storybook-$STORYBOOK_FRAMEWORK/storybook-static/" \
  "s3://$STORYBOOK_BUCKET/latest/" \
  --delete \
  --dryrun \
  --cache-control "public,max-age=300,must-revalidate"
```

After reviewing the dry runs:

```bash
aws s3 sync "apps/storybook-$STORYBOOK_FRAMEWORK/storybook-static/" \
  "s3://$STORYBOOK_BUCKET/$STORYBOOK_VERSION/" \
  --cache-control "public,max-age=31536000,immutable"

aws s3 sync "apps/storybook-$STORYBOOK_FRAMEWORK/storybook-static/" \
  "s3://$STORYBOOK_BUCKET/latest/" \
  --delete \
  --cache-control "public,max-age=300,must-revalidate"

aws s3 cp "apps/storybook-$STORYBOOK_FRAMEWORK/storybook-static/robots.txt" \
  "s3://$STORYBOOK_BUCKET/robots.txt" \
  --content-type "text/plain; charset=utf-8" \
  --cache-control "public,max-age=300,must-revalidate"
```

`--delete` is allowed only on the exact `latest/` prefix, never on a Storybook
bucket root or version prefix. Root `robots.txt` is required because crawlers
request `/robots.txt`, not only `/latest/robots.txt`.

Do not copy this release into older version prefixes. Historical backfill is
outside this runbook.

## Configure real 404 responses

On the dashboard CloudFront distribution, configure both custom error
responses:

| Origin error | Response page path | Viewer response |
| --- | --- | --- |
| `403` | `/404.html` | `404` |
| `404` | `/404.html` | `404` |

Private S3 origins can return `403` for missing objects. Mapping both statuses
prevents missing AI resources from becoming soft `200` responses. Follow AWS's
[custom error page and error caching
documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistValuesErrorPages.html).
Keep `/404.html` in the dashboard bucket and use a short error-cache TTL while
validating a release.

The documentation build emits real objects such as
`docs/components/button/index.html`. An S3 REST origin does not automatically
map a request for `/docs/components/button/` to that object. Keep the static
files and configure a CloudFront viewer-request rewrite that appends
`index.html` only when the request URI ends in `/`. Do not replace missing
routes with the homepage: an unknown documentation path must still reach the
origin and return the real `/404.html` response above.

Before invalidation, inspect the active distribution behavior and confirm both
conditions explicitly:

- a viewer-request function or equivalent rewrite maps `/docs/x/` to
  `/docs/x/index.html` without changing the viewer URL;
- the `403` and `404` custom-error mappings still return `/404.html` with viewer
  status `404` for objects that do not exist.

The trailing-slash rewrite and real-404 policy are complementary. A catch-all
rewrite to `/index.html` is not valid for this static MPA.

## Invalidate, wait, and smoke

Invalidate the dashboard once:

```bash
DASHBOARD_INVALIDATION_ID="$(
  aws cloudfront create-invalidation \
    --distribution-id "$DASHBOARD_DISTRIBUTION_ID" \
    --paths "/*" \
    --query Invalidation.Id \
    --output text
)"
aws cloudfront wait invalidation-completed \
  --distribution-id "$DASHBOARD_DISTRIBUTION_ID" \
  --id "$DASHBOARD_INVALIDATION_ID"

pnpm site:smoke -- --origin https://marwes.io --site dashboard --mode all
test "$(curl -sS -o /dev/null -w '%{http_code}' \
  https://marwes.io/docs/components/button/)" = "200"
test "$(curl -sS -o /dev/null -w '%{http_code}' \
  https://marwes.io/docs/components/this-route-must-not-exist/)" = "404"
test "$(curl -sS -o /dev/null -w '%{http_code}' \
  https://marwes.io/ai/this-resource-must-not-exist.json)" = "404"
curl -fsSI https://marwes.io/ai/index.json | rg -i \
  "^content-type: application/json"
curl -fsSI https://marwes.io/ai/index.json | rg -i \
  "^cache-control: public,max-age=300,must-revalidate"
```

After each Storybook deployment, use the selected target variables:

```bash
STORYBOOK_INVALIDATION_ID="$(
  aws cloudfront create-invalidation \
    --distribution-id "$STORYBOOK_DISTRIBUTION_ID" \
    --paths "/robots.txt" "/latest/*" \
    --query Invalidation.Id \
    --output text
)"
aws cloudfront wait invalidation-completed \
  --distribution-id "$STORYBOOK_DISTRIBUTION_ID" \
  --id "$STORYBOOK_INVALIDATION_ID"

pnpm site:smoke -- \
  --origin "$STORYBOOK_ORIGIN" \
  --site storybook
pnpm site:smoke -- \
  --origin "$STORYBOOK_ORIGIN" \
  --site storybook \
  --version "$STORYBOOK_VERSION"
curl -fsS "$STORYBOOK_ORIGIN/$STORYBOOK_VERSION/" | rg \
  'name="robots" content="noindex,follow,noarchive"'
curl -fsS "$STORYBOOK_ORIGIN/latest/" | rg \
  'name="robots" content="noindex,follow,noarchive"'
```

The wait command must complete and every smoke check must pass for all three
Storybooks. If one fails, inspect S3 object metadata, CloudFront invalidation
status, and response headers. Do not repair a failed release by deleting bucket
roots or historical prefixes.
