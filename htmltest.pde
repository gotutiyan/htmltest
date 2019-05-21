final int sec = 60;
float w = 0, h = 0;

float t = 0;
float step = 0.01;

Background background;
Loading loading;
Shabon[] shabon = new Shabon[4];

void setup()
{
  size(600, 480);

  w = width;
  h = height;

  loading = new Loading();
  background = new Background();

  for (int i = 0; i < 4; i++)
  {
    shabon[i] = new Shabon();
    shabon[i].setup();
  }

  loading.setup();
}

void draw()
{

  background.draw();
  for (int i = 0; i < 4; i++)
    shabon[i].draw();
  loading.draw();

  t += step;
}

class Background
{
  float numDiv = 5;
  color c1 = color(90, 140, 255), c2 = color(0, 10, 40);
  color c;

  void draw()
  {  
    noStroke();

    for (float y = 0; y < height; y += numDiv)
    {
      c = lerpColor(c1, c2, y/h);
      fill(c);

      rect(0, y, w, numDiv);
    }
  }
}

class Ball
{
  static int numBall = 10;  // Value of Ball's num
  int numPos = 4;  // Value of Ball's position

  PVector[] startPos = new PVector[numBall];  // Ball's initialize position
  PVector[] changePos = new PVector[numPos];  // Ball's real position

  float[] r = new float[numBall];  // Ball's radius
  Ball[] ball = new Ball[numBall];

  /// Ball drawing ///
  void BallDraw(PVector p, float r)
  {
    ellipse(p.x, p.y, r, r);
  }
}

class Loading extends Ball
{

  color col;

  // Initialize //
  void setup()
  {
    col  = color(random(200, 230), random(100, 200), 255);

    for (int i = 0; i < numBall; i++)
    {
      ball[i] = new Ball();

      r[i] += 2.4 * (i + 1);
      startPos[i] = new PVector(w/2, h/i);

      for (int j = 0; j < numPos; j++)
        changePos[j] = new PVector(0, 0);
    }
  }

  // "Loaing" Drawing
  void draw()
  {
    for (int i = 0; i < numBall; i++)
    {
      for (int j = 0; j < numPos; j++)
      {
        if (frameCount % (sec * 3)  == 0)
          col = color(random(200, 230), random(100, 200), 255);

        fill(col);
        stroke(col);

        changePos[0] = new PVector( ((cos((t / 2) * (i + 1)) - sin((t / 2) * (i + 1))) * startPos[i].x) / 2 + (w/2), ((sin((t / 2) * (i + 1)) + cos((t / 2) * (i + 1))) * startPos[i].x) / 2 + (h / 2));
        changePos[1] = new PVector( -(cos((t / 4) * (i + 1)) - sin((t / 4) * (i + 1))) * startPos[i].x /4 + (w/2), -(sin((t / 4) * (i + 1)) + cos((t / 4) * (i + 1))) * startPos[i].x /4 + (h / 2));
        changePos[2] = new PVector( (-((cos((t / 2) * (i + 1)) - sin((t / 2) * (i + 1)))) * startPos[i].x) / 2+ (w/2), (((sin((t / 2) * (i + 1)) - cos((t / 2) * (i + 1)))) * startPos[i].x) / 2 + (h / 2));
        changePos[3] = new PVector( (((cos((t / 2) * (i + 1)) - sin((t / 2) * (i + 1))) * startPos[i].x) / 2 + (w/2)), (((sin((t / 2) * (i + 1)) - cos((t / 2) * (i + 1))) * startPos[i].x)) / 2 + (h / 2));

        ball[i].BallDraw(changePos[j], r[i]);
      }
    }
  }
}

class Shabon extends Ball
{
  float spdY[] = new float[numBall];
  float[] radius = new float[numBall];

  void setup()
  {

    for (int i = 0; i < numBall; i++)
    {
      ball[i] = new Ball();

      spdY[i] = random(0, 3);

      r[i] = random(2, 20);

      startPos[i] = new PVector(random(0, w), h);

      for (int j = 0; j < numPos; j++)
      {
        changePos[j] = new PVector(0, 0);
      }
    }
  }

  void draw()
  {
    for (int i = 0; i < numBall; i++)
    {
      for (int j = 0; j < numPos; j++)
      {
        changePos[j] = new PVector((sin(t * 5) * (i + 1)) * 2 + startPos[i].x, startPos[i].y);

        stroke(0, 100, 255, (startPos[i].y / h) * 100);
        fill(0, (h/startPos[i].y) * 100, (h/startPos[i].y) * 100, (startPos[i].y / h) * 100);

        ball[i].BallDraw(changePos[j], r[i]);
      }
      startPos[i].y -= spdY[i];

      if (startPos[i].y <= 0)
      {
        startPos[i] = new PVector(random(0, w), h);
        spdY[i] = random(0.1, 3.0);
      }
    }
  }
}