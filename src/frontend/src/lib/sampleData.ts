import type { Principal } from "@icp-sdk/core/principal";
import type { PostView } from "../backend";

const SECONDS_IN_HOUR = 3600n * 1_000_000_000n;
const NOW = BigInt(Date.now()) * 1_000_000n;

function fakePrincipal(id: string): Principal {
  return { toString: () => id, toText: () => id } as unknown as Principal;
}

export const samplePosts: PostView[] = [
  {
    id: 1n,
    content:
      "Just finished reading 'The Giver' for English class — the ending gave me so many feelings! Has anyone else read it? What did you think about Jonas's choice? 📚",
    author: "Maya K.",
    authorPrincipal: fakePrincipal("sample-1"),
    likes: [fakePrincipal("a"), fakePrincipal("b"), fakePrincipal("c")],
    timestamp: NOW - SECONDS_IN_HOUR * 2n,
    comments: [
      {
        id: 1n,
        content:
          "I loved it! The ending was so thought-provoking. Jonas was so brave!",
        author: "Jordan S.",
        authorPrincipal: fakePrincipal("b"),
        timestamp: NOW - SECONDS_IN_HOUR,
      },
      {
        id: 2n,
        content:
          "It's one of my favourites! Made me think a lot about freedom.",
        author: "Priya M.",
        authorPrincipal: fakePrincipal("c"),
        timestamp: NOW - SECONDS_IN_HOUR / 2n,
      },
    ],
  },
  {
    id: 2n,
    content:
      "We had a debate about social media in class today — do you think platforms help or hurt mental health for teens? I think it depends on how you use it! 💭",
    author: "Alex T.",
    authorPrincipal: fakePrincipal("sample-2"),
    likes: [fakePrincipal("d"), fakePrincipal("e")],
    timestamp: NOW - SECONDS_IN_HOUR * 5n,
    comments: [
      {
        id: 3n,
        content:
          "Great point! I think it can be both — it's all about balance.",
        author: "Sam W.",
        authorPrincipal: fakePrincipal("d"),
        timestamp: NOW - SECONDS_IN_HOUR * 4n,
      },
    ],
  },
  {
    id: 3n,
    content:
      "My science project on bioluminescence is done! 🌊✨ I used glowing jellyfish as my topic. It turns out some creatures make their own light through chemical reactions. Nature is truly amazing!",
    author: "Zoe P.",
    authorPrincipal: fakePrincipal("sample-3"),
    likes: [
      fakePrincipal("f"),
      fakePrincipal("g"),
      fakePrincipal("h"),
      fakePrincipal("i"),
    ],
    timestamp: NOW - SECONDS_IN_HOUR * 24n,
    comments: [],
  },
  {
    id: 4n,
    content:
      "Anyone else nervous about the school talent show next week? I'm doing a spoken word poem about growing up between two cultures. Super nervous but also really excited! 🎤",
    author: "Liam C.",
    authorPrincipal: fakePrincipal("sample-4"),
    likes: [fakePrincipal("j")],
    timestamp: NOW - SECONDS_IN_HOUR * 48n,
    comments: [
      {
        id: 4n,
        content: "That sounds amazing! You've got this! 🌟",
        author: "Maya K.",
        authorPrincipal: fakePrincipal("a"),
        timestamp: NOW - SECONDS_IN_HOUR * 46n,
      },
    ],
  },
  {
    id: 5n,
    content:
      "Hot take: school lunch should include more vegetarian options. Not just a sad salad but actually good food. Who agrees? 🥗",
    author: "Priya M.",
    authorPrincipal: fakePrincipal("sample-5"),
    likes: [
      fakePrincipal("k"),
      fakePrincipal("l"),
      fakePrincipal("m"),
      fakePrincipal("n"),
      fakePrincipal("o"),
    ],
    timestamp: NOW - SECONDS_IN_HOUR * 72n,
    comments: [
      {
        id: 5n,
        content: "100% agree! Also more fruit options would be great.",
        author: "Alex T.",
        authorPrincipal: fakePrincipal("d"),
        timestamp: NOW - SECONDS_IN_HOUR * 70n,
      },
    ],
  },
  {
    id: 6n,
    content:
      "I drew a portrait of my grandmother today for art class. It took me 3 hours but I'm really proud of how it turned out. Art helps me express things I can't always say in words 🎨",
    author: "Jordan S.",
    authorPrincipal: fakePrincipal("sample-6"),
    likes: [fakePrincipal("p"), fakePrincipal("q"), fakePrincipal("r")],
    timestamp: NOW - SECONDS_IN_HOUR * 96n,
    comments: [],
  },
];
