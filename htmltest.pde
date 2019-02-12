float sz=0;
void setup() {
  //size(500, 500);
  sz=width;
}
void draw() {
  background(255);
  rec(0, 0, sz);
}
void rec(float x,float y,float size) {
  if (size<10)return;
  fill(random(255),100,100);
  rect(x, y, size, size);
  float p=0.65;
  size/=2;
  if (random(1)<p)rec(x, y, size);
  if (random(1)<p)rec(x, y+size, size);
  if (random(1)<p)rec(x+size, y, size);
  if (random(1)<p)rec(x+size, y+size, size);
  return;
}
void keyPressed(){
}