# Buffer MCP — Known Issues & Usage Guide

Source: `/Users/anderbilbaocastejon/.claude/buffer-mcp/` (v2.0.0, GraphQL v2 client).

## TL;DR

The MCP is already on Buffer v2 (GraphQL at `https://api.buffer.com`). The v1 REST API
(`https://api.bufferapp.com/1/...`) is dead for OIDC-style tokens — if you curl it you
will get `{"error":"OIDC tokens are not accepted for direct API access","code":401}`.
Do not use v1.

Token configured in `~/Desktop/Egoera Psikologia/.mcp.json`:

```
BUFFER_ACCESS_TOKEN=fuYHgmZzPnxD8r9AFJ8vy4b87hQQ5mOi2_9ld_I9ib7
```

Organization: `Egoera Psikologia` — `id=69ced7393692a16aba3bbb05`.
Account: `id=69ced7393692a16aba3bbb03`.

## Verified endpoint / schema

```bash
curl -s -X POST "https://api.buffer.com" \
  -H "Authorization: Bearer $BUFFER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { account { id currentOrganization { id name } } }"}'
```

Returns `account.id` and `currentOrganization.id/name`. Use this as the smoke test.

## Common errors and how to avoid them

### 1. Instagram post_create without `ig_type` → API error

The `post_create` tool accepts an `ig_type` enum (`post` | `reel` | `story`). For any
Instagram channel it is **required** — without it, Buffer rejects the mutation with a
metadata validation error.

Correct call (post to IG feed):

```json
{
  "channel_id": "<ig channel id>",
  "text": "...",
  "ig_type": "post"
}
```

Reel: `"ig_type": "reel"`. Story: `"ig_type": "story"`.

Implementation reference: `src/tools/posts.ts` line ~142, which sets
`input.metadata.instagram = { type: ig_type, shouldShareToFeed: true }` only when
`ig_type` is provided.

### 2. Prefer `idea_create` when you are not sure of the IG type

The Ideas board does not require `ig_type` — services is a simple enum array
(`["instagram", "tiktok", ...]`). If the workflow is "queue content for later review",
use `idea_create` instead of `post_create`. This bypasses the whole IG-type trap.

### 3. YouTube requires `yt_title` AND `yt_category`

Both must be provided for YouTube channels — omitting either fails.

### 4. 429 rate limit: 100 requests / 15 minutes

`api-client.ts` detects this explicitly. Back off `retryAfter` seconds before retrying.

### 5. `channel_id` is required and must come from `channels_list`

`channel_id` is a Buffer-internal ID, not the platform handle. Always call
`channels_list` for the organization first and pick the right channel.

### 6. Do **NOT** hit `api.bufferapp.com/1/` from the MCP

The MCP's api-client only targets `api.buffer.com` (v2 GraphQL). If you see an error
mentioning `bufferapp.com`, something (agent code, another tool) is bypassing the MCP.
The OIDC token will always fail on v1.

## Useful queries for debugging

### List channels for the organization

Use the `channels_list` tool with `organization_id=69ced7393692a16aba3bbb05`.

### List recently-sent posts

Use `posts_list` with `status=["sent"]`, `sort_by=createdAt`, `sort_direction=desc`.

### Fetch organization + account

Raw GraphQL:

```graphql
query { account { id currentOrganization { id name } } }
```

## When in doubt

1. Run the account smoke test above to confirm the token still works.
2. If `post_create` fails on Instagram, re-send with explicit `ig_type`.
3. If you just want to park content, prefer `idea_create` — no `type` trap.
