export const piscum = [
  require("../assets/piscum/1-1000x1000.jpg"),
  require("../assets/piscum/100-1000x1000.jpg"),
  require("../assets/piscum/130-1000x1000.jpg"),
  require("../assets/piscum/141-1000x1000.jpg"),
  require("../assets/piscum/143-1000x1000.jpg"),

  require("../assets/piscum/144-1000x1000.jpg"),
  require("../assets/piscum/165-1000x1000.jpg"),
  require("../assets/piscum/167-1000x1000.jpg"),
  require("../assets/piscum/169-1000x1000.jpg"),
  require("../assets/piscum/170-1000x1000.jpg"),

  require("../assets/piscum/170-1000x1000.jpg"),
  require("../assets/piscum/206-1000x1000.jpg"),
  require("../assets/piscum/210-1000x1000.jpg"),
  require("../assets/piscum/23-1000x1000.jpg"),
  require("../assets/piscum/238-1000x1000.jpg"),

  require("../assets/piscum/239-1000x1000.jpg"),
  require("../assets/piscum/240-1000x1000.jpg"),
  require("../assets/piscum/29-1000x1000.jpg"),
  require("../assets/piscum/30-1000x1000.jpg"),
  require("../assets/piscum/31-1000x1000.jpg"),

  require("../assets/piscum/60-1000x1000.jpg"),
  require("../assets/piscum/62-1000x1000.jpg"),
  require("../assets/piscum/64-1000x1000.jpg"),
  require("../assets/piscum/65-1000x1000.jpg"),
  require("../assets/piscum/66-1000x1000.jpg"),

  require("../assets/piscum/93-1000x1000.jpg"),
  require("../assets/piscum/94-1000x1000.jpg"),
];

export const avatar = [
  require("../assets/avatar/1000 (1).jpg"),
  require("../assets/avatar/1000 (10).jpg"),
  require("../assets/avatar/1000 (11).jpg"),
  require("../assets/avatar/1000 (12).jpg"),
  require("../assets/avatar/1000 (13).jpg"),

  require("../assets/avatar/1000 (14).jpg"),
  require("../assets/avatar/1000 (15).jpg"),
  require("../assets/avatar/1000 (2).jpg"),
  require("../assets/avatar/1000 (3).jpg"),
  require("../assets/avatar/1000 (4).jpg"),

  require("../assets/avatar/1000 (5).jpg"),
  require("../assets/avatar/1000 (6).jpg"),
  require("../assets/avatar/1000 (7).jpg"),
  require("../assets/avatar/1000 (8).jpg"),
  require("../assets/avatar/1000 (9).jpg"),

  require("../assets/avatar/1000 (16).jpg"),
  require("../assets/avatar/1000 (17).jpg"),
  require("../assets/avatar/1000 (18).jpg"),
  require("../assets/avatar/1000 (19).jpg"),
];

export interface DataProps {
  backdrop: string;
  profile: string;
}
export const testArray_slider = new Array(30).fill(0).map((item, index) => ({
  profile: randomImage(avatar),
  backdrop: randomImage(piscum),
}));
export const gallery_slider = new Array(30).fill(0).map((item, index) => ({
  profile: randomImage(avatar),
  backdrop: randomImage(piscum),
}));
export const testArray = new Array(30).fill(0).map((item, index) => ({
  profile: randomImage(avatar),
  backdrop: randomImage(piscum),
}));

export function randomImage(array: any[]) {
  const Randomindex = Math.floor(Math.random() * array.length);
  return array[Randomindex];
}
