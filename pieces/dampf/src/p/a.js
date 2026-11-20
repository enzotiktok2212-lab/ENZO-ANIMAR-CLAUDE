// TEST: una persona vapeando en la plaza
shot(0, null, null, L => { use('HB'); const c = put(EX[3], -6, 0, 0, 0); vaper(c, L, .2, 1.4, { meter: true, expr: 'smug' });
  orbit(V(-6, 6.0, 0), 7.5, .35, .05, 40); sh(V(-6, 0, 0), 20); });
shot(4, null, null, L => { use('HB'); const c = put(EX[3], -6, 0, 0, 0); vaper(c, L, 4.2, 1.4, { meter: true, expr: 'smug' });
  orbit(V(-6, 5.2, 0), 9, -.9, .05, 40); sh(V(-6, 0, 0), 20); });
shot(8.4, null, null, L => { use('HB'); cam([0,5,20],[0,4,0]); });
