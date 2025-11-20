"use strict";
const tmdbAPI = require("../helpers/axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

class Movies_ctrl {
  //* ─── Get All ─────────────────────────────────────────────────────────
  static async getAll(req, res, next) {
    try {
      const { search, page = 1 } = req.query;
      // console.log("🚀 ~ Movies_ctrl ~ getAll ~ search:", search);

      let movies;
      if (search) {
        movies = await tmdbAPI.get("/search/movie", {
          params: {
            query: search,
            page,
          },
        });
      } else {
        movies = await tmdbAPI.get("/discover/movie", {
          params: {
            page,
          },
        });
      }

      // console.log("🚀 ~ Movies_ctrl ~ getAll ~ movies:", movies);
      res.status(200).json(movies.data);
    } catch (error) {
      console.log("🚀 ~ Movies_ctrl ~ getAll ~ error:", error);
      next(error);
    }
  }

  //* ─── Get Backdrop ─────────────────────────────────────────────────────
  static async getPoster(req, res, next) {
    try {
      const { data } = await tmdbAPI.get("/movie/popular");
      // console.log("🚀 ~ Movies_ctrl ~ getPoster ~ data:", data);

      const movies = [];

      data.results.map((movie) => {
        movies.push({
          backdrop_path: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
          poster_path: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        });
      });

      // console.log("🚀 ~ Movies_ctrl ~ getAll ~ movies:", movies);
      res.status(200).json(movies);
    } catch (error) {
      console.log("🚀 ~ Movies_ctrl ~ getAll ~ error:", error);
      next(error);
    }
  }

  //* ─── Get Popular ───────────────────────────────────────────────────────────
  static async getPopular(req, res, next) {
    try {
      const { page = 1 } = req.query;
      const { data } = await tmdbAPI.get("movie/top_rated", {
        params: {
          page,
        },
      });
      // console.log("🚀 ~ Movies_ctrl ~ getAll ~ data:", data);
      res.status(200).json(data);
    } catch (error) {
      console.log("🚀 ~ Movies_ctrl ~ getAll ~ error:", error);
      next(error);
    }
  }

  //* ─── Get Detail ──────────────────────────────────────────────────────
  static async getDetail(req, res, next) {
    try {
      const { tmdbId } = req.params;

      const { data } = await tmdbAPI.get(`/movie/${tmdbId}`);
      res.status(200).json({
        id: data.id,
        title: data.title,
        backdrop_path: data.backdrop_path,
        genres: data.genres,
        original_language: data.original_language,
        overview: data.overview,
        vote_count: data.vote_count,
        vote_average: data.vote_average,
        poster_path: data.poster_path,
        release_date: data.release_date,
        adult: data.adult,
      });
    } catch (error) {
      console.log(
        "🚀 ~ Movies_ctrl ~ getDetail ~ error:",
        error.response.data.status_message
      );
      next(error);
    }
  }

  //* ─── Ai Recommendation ───────────────────────────────────────────────
  static async getAi(req, res, next) {
    //? ─── Google ──────────────────────────────────────────────────
    try {
      const { userRequest } = req.body;
      // console.log("🚀 ~ Movies_ctrl ~ getAi ~ req.body:", req.body);
      // console.log("🚀 ~ Movies_ctrl ~ getAi ~ userRequest:", userRequest);

      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_STUDIO_API_KEY);

      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
      });

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: `kamu adalah seorang yang ahli dalam film, dan setiap ditanya kamu menjawab tanpa respon yang lain dan hanya memberikan array judul movie yang sesuai merujuk kepada tmdb,
                  contoh: ["Castle in the Sky", "My Neighbor Totoro", "Grave of the Fireflies", "Princess Mononoke", "Spirited Away", "Howl's Moving Castle", "Ponyo", "The Tale of the Princess Kaguya", "The Wind Rises", "When Marnie Was There", "The Red Turtle"]`,
              },
            ],
          },
          {
            role: "model",
            parts: [{ text: "Oke, mengerti. Beri aku pertanyaanmu." }],
          },
        ],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
      });

      const msg = userRequest;
      const result = await chat.sendMessage(msg);
      // console.log("🚀 ~ Movies_ctrl ~ getAi ~ result:", result);
      const response = await result.response;
      // console.log("🚀 ~ Movies_ctrl ~ getAi ~ response:", response);
      const text = await response.text();
      // console.log("🚀 ~ Movies_ctrl ~ getAi ~ text:", text);

      const movies = [];

      for (const movie of JSON.parse(text)) {
        const { data } = await tmdbAPI.get("/search/movie", {
          params: {
            query: movie.trim(),
          },
        });
        if (data.results.length > 0) {
          movies.push(data.results[0]);
        }
      }

      const output = movies.map((el) => ({
        id: el.id,
        title: el.title,
        backdrop_path: el.backdrop_path,
        genres: el.genres,
        original_language: el.original_language,
        overview: el.overview,
        vote_count: el.vote_count,
        vote_average: el.vote_average,
        poster_path: el.poster_path,
        release_date: el.release_date,
        adult: el.adult,
      }));

      res.status(200).json({ response: output });
    } catch (error) {
      console.log("🚀 ~ Movies_ctrl ~ getAi ~ error:", error.message);
      next(error);
    }
  }
}

module.exports = Movies_ctrl;
