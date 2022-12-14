import{ serve } from "https://deno.land/std@0.138.0/http/server.ts";
import{ serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

import wordException from "./public/wordsetting.js";

let previousWord = "しりとり";

console.log("Listening on http://localhost:8000");
serve(async (req) => {

	const pathname = new URL(req.url).pathname;
	console.log(pathname);

	if (req.method === "GET" && pathname === "/shiritori") {
		return new Response(previousWord);
	}

	if (req.method === "POST" && pathname === "/shiritori") {
		const requestJson = await req.json();
		const nextWord = requestJson.nextWord;

		//判定用の変数
		let firstNextWord = wordException(nextWord.charAt(0));
		let lastPreviousWord = wordException(previousWord.charAt(previousWord.length - 1));

		if(nextWord !== "しりとり"){
			console.log(previousWord);
			if (
				nextWord.length > 0 &&
				lastPreviousWord !== firstNextWord
				){
				return new Response("前の単語に続いていません。",{ status: 400 });
			}
		}

		if (!nextWord.trim() ){
			return new Response("空白はダメ",{ status: 400 });
		}

		if ( nextWord.charAt(nextWord.length -1) === "ん") {
			return new Response("んで終わっています",{ status: 400 });
		}



		previousWord = nextWord;
		return new Response(previousWord);
	}

	//ファイルサーバー	
	return serveDir(req, {  

		fsRoot: "public",
		urlRoot: "",
		showDirListing: true,
		enableCors: true,

	});
});

//git commit -am "test"
//git push   でいける