(() => {
  const root = document.querySelector("[data-nsgf-demo]");
  if (!root) return;

  const nuInput = root.querySelector("#rh-nu");
  const timeInput = root.querySelector("#rh-time");
  const nuOutput = root.querySelector("#rh-nu-value");
  const timeOutput = root.querySelector("#rh-time-value");
  const endpointPath = root.querySelector("#rh-endpoint-path");
  const finitePath = root.querySelector("#rh-finite-path");
  const pole = root.querySelector("#rh-pole");
  const poleLabel = root.querySelector("#rh-pole-label");
  const crossoverLine = root.querySelector("#rh-crossover-line");
  const crossoverDot = root.querySelector("#rh-crossover-dot");
  const crossoverLabel = root.querySelector("#rh-crossover-label");
  const tailRegion = root.querySelector("#rh-tail-region");
  const headRegion = root.querySelector("#rh-head-region");

  const plot = { left: 64, right: 712, top: 34, bottom: 326 };
  const domain = { min: 0.08, max: 3.2, yMin: 0, yMax: 3 };
  const xScale = (mu) => plot.left + ((mu - domain.min) / (domain.max - domain.min)) * (plot.right - plot.left);
  const yScale = (value) => plot.bottom - ((value - domain.yMin) / (domain.yMax - domain.yMin)) * (plot.bottom - plot.top);
  const clampY = (value) => Math.min(domain.yMax, Math.max(domain.yMin, value));

  const finiteFilter = (mu, nu, time) => {
    const delta = mu - nu;
    const tolerance = 1e-7 * Math.max(1, Math.abs(mu), Math.abs(nu));
    if (Math.abs(delta) <= tolerance) return nu * time;
    return (mu * -Math.expm1(-time * delta)) / delta;
  };

  const buildPath = (start, end, steps, filter) => {
    const commands = [];
    for (let index = 0; index <= steps; index += 1) {
      const mu = start + ((end - start) * index) / steps;
      const value = clampY(filter(mu));
      commands.push(`${index === 0 ? "M" : "L"} ${xScale(mu).toFixed(2)} ${yScale(value).toFixed(2)}`);
    }
    return commands.join(" ");
  };

  const findCrossover = (nu, time) => {
    let previousMu = domain.min;
    let previousValue = finiteFilter(previousMu, nu, time) - 1;
    const steps = 700;
    for (let index = 1; index <= steps; index += 1) {
      const mu = domain.min + ((domain.max - domain.min) * index) / steps;
      const value = finiteFilter(mu, nu, time) - 1;
      if (previousValue <= 0 && value > 0) {
        const weight = -previousValue / (value - previousValue);
        return previousMu + weight * (mu - previousMu);
      }
      previousMu = mu;
      previousValue = value;
    }
    return previousValue > 0 ? domain.min : domain.max;
  };

  const update = () => {
    const nu = Number(nuInput.value);
    const time = Number(timeInput.value);
    const poleX = xScale(nu);
    const crossover = findCrossover(nu, time);
    const crossoverX = xScale(crossover);

    nuOutput.value = nu.toFixed(2);
    nuOutput.textContent = nu.toFixed(2);
    timeOutput.value = time.toFixed(2);
    timeOutput.textContent = time.toFixed(2);

    finitePath.setAttribute(
      "d",
      buildPath(domain.min, domain.max, 420, (mu) => finiteFilter(mu, nu, time))
    );
    endpointPath.setAttribute(
      "d",
      buildPath(Math.min(domain.max, nu + 0.025), domain.max, 260, (mu) => mu / (mu - nu))
    );

    pole.setAttribute("x1", poleX);
    pole.setAttribute("x2", poleX);
    poleLabel.setAttribute("x", Math.min(plot.right - 70, poleX + 8));

    crossoverLine.setAttribute("x1", crossoverX);
    crossoverLine.setAttribute("x2", crossoverX);
    crossoverDot.setAttribute("cx", crossoverX);
    crossoverLabel.setAttribute("x", Math.min(plot.right - 72, crossoverX + 8));

    tailRegion.setAttribute("width", Math.max(0, crossoverX - plot.left));
    headRegion.setAttribute("x", crossoverX);
    headRegion.setAttribute("width", Math.max(0, plot.right - crossoverX));
  };

  nuInput.addEventListener("input", update);
  timeInput.addEventListener("input", update);
  update();
})();
