// Match the reference's 620ms screen collapse plus its final 20ms fade.
export const TOUR_EXIT_MS = 640;
export function createTourExit({ stop, begin, complete, reducedMotion = () => false, schedule = setTimeout, cancel = clearTimeout }) {
  let phase = 'open', timer;
  const finish = () => {
    if (phase !== 'closing') return;
    phase = 'closed';
    if (timer !== undefined) cancel(timer);
    complete();
  };
  return {
    start() {
      if (phase !== 'open') return;
      phase = 'closing';
      stop();
      if (reducedMotion()) { finish(); return; }
      begin();
      timer = schedule(finish, TOUR_EXIT_MS);
    },
    finish,
    dispose() {
      phase = 'disposed';
      if (timer !== undefined) cancel(timer);
    },
  };
}
