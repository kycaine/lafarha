async function test() {
  const url = "https://dev-farha.pages.dev/api/proxy/users/upsert";
  console.log("Testing POST to", url);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "dummy_final",
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
