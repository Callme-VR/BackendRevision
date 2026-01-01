import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
    adapter,
    log: ["error"],
    errorFormat: "pretty"
});

const movies = [
  {
    title: "The Matrix",
    overview: "A computer hacker learns about the true nature of reality.",
    releaseYear: 1999,
    genres: ["Action", "Sci-Fi"],
    runtime: 136,
    posterUrl: "https://example.com/matrix.jpg",
  },
  {
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through dream-sharing technology.",
    releaseYear: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    runtime: 148,
    posterUrl: "https://example.com/inception.jpg",
  },
  {
    title: "The Dark Knight",
    overview: "Batman faces the Joker in a battle for Gotham's soul.",
    releaseYear: 2008,
    genres: ["Action", "Crime", "Drama"],
    runtime: 152,
    posterUrl: "https://example.com/darkknight.jpg",
  },
  {
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, and others intertwine.",
    releaseYear: 1994,
    genres: ["Crime", "Drama"],
    runtime: 154,
    posterUrl: "https://example.com/pulpfiction.jpg",
  },
  {
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space.",
    releaseYear: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    posterUrl: "https://example.com/interstellar.jpg",
  },
  {
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years.",
    releaseYear: 1994,
    genres: ["Drama"],
    runtime: 142,
    posterUrl: "https://example.com/shawshank.jpg",
  },
  {
    title: "Fight Club",
    overview:
      "An insomniac office worker and a devil-may-care soapmaker form an underground fight club.",
    releaseYear: 1999,
    genres: ["Drama"],
    runtime: 139,
    posterUrl: "https://example.com/fightclub.jpg",
  },
  {
    title: "Forrest Gump",
    overview:
      "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.",
    releaseYear: 1994,
    genres: ["Drama", "Romance"],
    runtime: 142,
    posterUrl: "https://example.com/forrestgump.jpg",
  },
  {
    title: "The Godfather",
    overview:
      "The aging patriarch of an organized crime dynasty transfers control to his son.",
    releaseYear: 1972,
    genres: ["Crime", "Drama"],
    runtime: 175,
    posterUrl: "https://example.com/godfather.jpg",
  },
  {
    title: "Goodfellas",
    overview: "The story of Henry Hill and his life in the mob.",
    releaseYear: 1990,
    genres: ["Biography", "Crime", "Drama"],
    runtime: 146,
    posterUrl: "https://example.com/goodfellas.jpg",
  },
];

const main = async () => {
  console.log("Starting seed process...");

  // Check if user exists, if not create one
  let user = await prisma.user.findUnique({
    where: { email: "seed@example.com" }
  });

  if (!user) {
    console.log("Creating seed user...");
    // Hash a default password for the seed user
    const hashedPassword = await bcrypt.hash('seedpassword123', 10);
    
    user = await prisma.user.create({
      data: {
        name: "Seed User",
        email: "seed@example.com",
        password: hashedPassword
      }
    });
    console.log(`Created user: ${user.email} (${user.id})`);
  } else {
    console.log(`Using existing user: ${user.email} (${user.id})`);
  }

  const userId = user.id;

  // Clear existing movies (optional - comment out if you want to keep existing data)
  const existingMoviesCount = await prisma.movie.count();
  if (existingMoviesCount > 0) {
    console.log(`Found ${existingMoviesCount} existing movies. Clearing...`);
    await prisma.movie.deleteMany({});
    console.log("Cleared existing movies");
  }

  console.log("Seeding movies...");

  // Create movies with the user ID
  for (const movie of movies) {
    await prisma.movie.create({
      data: {
        ...movie,
        createdBy: userId,
      },
    });
    console.log(`Created movie: ${movie.title}`);
  }

  console.log("Seeding completed!");
  console.log(`Total movies created: ${movies.length}`);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });