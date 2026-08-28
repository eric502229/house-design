export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

export async function onRequestGet(context) {
  const { env } = context;
  const raw = await env.ROOMSYNC.get("room-plans");
  return jsonResponse(
    raw ? JSON.parse(raw) : { v: 1, updated: "", by: "", meta: {}, plans: [] },
    200
  );
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const body = await request.text();

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  if (!parsed || !Array.isArray(parsed.plans)) {
    return jsonResponse({ ok: false, error: "invalid_plans" }, 400);
  }

  await env.ROOMSYNC.put("room-plans", JSON.stringify(parsed));
  return jsonResponse({ ok: true, updated: parsed.updated || "" }, 200);
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders()
    }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
