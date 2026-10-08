async function test() {
  const url = "http://127.0.0.1:3000/api/proxy/users/upsert";
  console.log("Testing POST to", url);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "dummy_123",
        email: "talkto.rezki@gmail.com",
        display_name: "Test User",
        photo_url: "",
        is_master: true
      })
    });
    const status = res.status;
    const text = await res.text();
    console.log("STATUS:", status);
    console.log("RESPONSE:", text);
  } catch(e) {
    console.error("ERROR:", e);
  }
}
test();
