export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Gunakan POST method", { status: 405 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response("File tidak ditemukan", { status: 400 });
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file, file.name || "upload.bin");

    const response = await fetch("https://store1.gofile.io/uploadFile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GOFILE_TOKEN}`,
      },
      body: uploadForm,
    });

    const result = await response.json();

    if (!result.status || result.status !== "ok") {
      return new Response("Gagal upload ke GoFile", { status: 500 });
    }

    return new Response(JSON.stringify(result.data), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
