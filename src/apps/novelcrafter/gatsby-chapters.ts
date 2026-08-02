// Assembled from content/gatsby/ch*.ts parts — do not edit chapter text by hand.
import { text as ch1 } from './content/gatsby/ch1';
import { text as ch2 } from './content/gatsby/ch2';
import { text as ch3 } from './content/gatsby/ch3';
import { text as ch4 } from './content/gatsby/ch4';
import { text as ch5 } from './content/gatsby/ch5';
import { text as ch6 } from './content/gatsby/ch6';
import { text as ch7 } from './content/gatsby/ch7';
import { text as ch8 } from './content/gatsby/ch8';
import { text as ch9 } from './content/gatsby/ch9';

export const gatsbyChapters = [
  { title: "Chapter I", scenes: [{ title: "Scene 1", text: ch1 }] },
  { title: "Chapter II", scenes: [{ title: "Scene 1", text: ch2 }] },
  { title: "Chapter III", scenes: [{ title: "Scene 1", text: ch3 }] },
  { title: "Chapter IV", scenes: [{ title: "Scene 1", text: ch4 }] },
  { title: "Chapter V", scenes: [{ title: "Scene 1", text: ch5 }] },
  { title: "Chapter VI", scenes: [{ title: "Scene 1", text: ch6 }] },
  { title: "Chapter VII", scenes: [{ title: "Scene 1", text: ch7 }] },
  { title: "Chapter VIII", scenes: [{ title: "Scene 1", text: ch8 }] },
  { title: "Chapter IX", scenes: [{ title: "Scene 1", text: ch9 }] }
] as const;
