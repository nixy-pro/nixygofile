export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Use POST method", { status: 405 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    const filename = file.name || "upload.bin";
    const uploadForm = new FormData();
    uploadForm.append("file", file, filename);

    const gofileRes = await fetch("https://store1.gofile.io/uploadFile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GOFILE_TOKEN}`,
      },
      body: uploadForm,
    });

    const result = await gofileRes.json();

    if (result.status === "ok") {
      return new Response(JSON.stringify(result.data), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: result.error }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  },
};
