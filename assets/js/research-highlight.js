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
  const finitePole = root.querySelector("#rh-finite-pole");
  const finitePoleLabel = root.querySelector("#rh-finite-pole-label");
  const crossoverLine = root.querySelector("#rh-crossover-line");
  const crossoverDot = root.querySelector("#rh-crossover-dot");
  const crossoverLabel = root.querySelector("#rh-crossover-label");
  const tailRegion = root.querySelector("#rh-tail-region");
  const headRegion = root.querySelector("#rh-head-region");
  const headGain = root.querySelector("#rh-head-gain");
  const headGainLine = root.querySelector("#rh-head-gain-line");
  const headGainEndpointDot = root.querySelector("#rh-gain-endpoint-dot");
  const headGainFiniteDot = root.querySelector("#rh-gain-finite-dot");
  const headGainLabel = root.querySelector("#rh-head-gain-label");

  const plot = { left: 64, right: 712, top: 34, bottom: 326 };
  const domain = { min: 0.08, max: 3.2, yMin: 0, yMax: 3 };
  const minimumPositiveEigenvalue = 0.48;
  const headProbe = 2.8;
  const xScale = (mu) => plot.left + ((mu - domain.min) / (domain.max - domain.min)) * (plot.right - plot.left);
  const yScale = (value) => plot.bottom - ((value - domain.yMin) / (domain.yMax - domain.yMin)) * (plot.bottom - plot.top);
  const clampY = (value) => Math.min(domain.yMax, Math.max(domain.yMin, value));

  const finiteFilter = (mu, nu, time) => {
    const delta = mu - nu;
    const tolerance = 1e-7 * Math.max(1, Math.abs(mu), Math.abs(nu));
    if (Math.abs(delta) <= tolerance) return nu * time;
    return (mu * -Math.expm1(-time * delta)) / delta;
  };

  const endpointEnvelope = (mu) => mu / (mu - minimumPositiveEigenvalue);

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

  const setPoint = (node, x, y) => {
    node.setAttribute("cx", x);
    node.setAttribute("cy", y);
  };

  const update = () => {
    const nu = Number(nuInput.value);
    const time = Number(timeInput.value);
    const endpointBarrierX = xScale(minimumPositiveEigenvalue);
    const finitePoleX = xScale(nu);
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
    endpointPath.setAttribute("d", buildPath(minimumPositiveEigenvalue + 0.025, domain.max, 300, endpointEnvelope));

    pole.setAttribute("x1", endpointBarrierX);
    pole.setAttribute("x2", endpointBarrierX);
    poleLabel.setAttribute("x", Math.min(plot.right - 160, endpointBarrierX + 8));

    finitePole.setAttribute("x1", finitePoleX);
    finitePole.setAttribute("x2", finitePoleX);
    finitePoleLabel.setAttribute("x", Math.min(plot.right - 112, finitePoleX + 8));

    crossoverLine.setAttribute("x1", crossoverX);
    crossoverLine.setAttribute("x2", crossoverX);
    crossoverDot.setAttribute("cx", crossoverX);
    crossoverLabel.setAttribute("x", Math.min(plot.right - 72, crossoverX + 8));

    tailRegion.setAttribute("width", Math.max(0, crossoverX - plot.left));
    headRegion.setAttribute("x", crossoverX);
    headRegion.setAttribute("width", Math.max(0, plot.right - crossoverX));

    const probeX = xScale(headProbe);
    const endpointValue = endpointEnvelope(headProbe);
    const finiteValue = finiteFilter(headProbe, nu, time);
    const endpointY = yScale(clampY(endpointValue));
    const finiteY = yScale(clampY(finiteValue));
    const showsGain = finiteValue > endpointValue + 0.03;

    headGain.style.display = showsGain ? "" : "none";
    if (showsGain) {
      headGainLine.setAttribute("x1", probeX);
      headGainLine.setAttribute("x2", probeX);
      headGainLine.setAttribute("y1", endpointY);
      headGainLine.setAttribute("y2", finiteY);
      setPoint(headGainEndpointDot, probeX, endpointY);
      setPoint(headGainFiniteDot, probeX, finiteY);
      headGainLabel.setAttribute("x", probeX - 154);
      headGainLabel.setAttribute("y", Math.max(plot.top + 18, Math.min(endpointY, finiteY) - 10));
    }
  };

  nuInput.addEventListener("input", update);
  timeInput.addEventListener("input", update);
  update();
})();
