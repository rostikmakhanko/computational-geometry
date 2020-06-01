import hermite.Drawer;
import hermite.HermiteSpline;

import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;

public class Main {

  private static final int VIEW_SCALE = 55;
  private static final ArrayList<Point2D> controlPoints =
      new ArrayList<Point2D>(
          Arrays.asList(
              new Point2D.Double[] {
                new Point2D.Double(1, 2), new Point2D.Double(2, 1), new Point2D.Double(4, 3),
                new Point2D.Double(5, 2), new Point2D.Double(6, 1), new Point2D.Double(7, 4),
                new Point2D.Double(8, 2), new Point2D.Double(9, 3), new Point2D.Double(10, 4)
              }));

  public static void main(String[] args) throws Exception {
    for (int i = 0; i < 100; i++) {
      Random r = new Random();
      int low = 1;
      int high = 10;
      int result = r.nextInt(high - low) + low;
      controlPoints.add(new Point2D.Double(10 + i * 1.0 /10, result));
    }

    HermiteSpline hermiteSpline = new HermiteSpline(controlPoints, null, false);
    //        HermiteSpline hermiteSpline = new HermiteSpline(controlPoints, derivativesTestInput,
    // true);
    hermiteSpline.generatePoints();
    ArrayList<Point2D> curvePoints = hermiteSpline.getCurvePoints();

    scalePoints(VIEW_SCALE, curvePoints);
    scalePoints(VIEW_SCALE, controlPoints);
    Drawer drawer = new Drawer("Hermite Spline", curvePoints, controlPoints, true);
  }

  /** Multiplies each coordinate of points array by coef internally. */
  public static void scalePoints(int coef, ArrayList<Point2D> points) {
    points.forEach(
        p -> {
          p.setLocation(p.getX() * coef, p.getY() * coef);
        });
  }
}
