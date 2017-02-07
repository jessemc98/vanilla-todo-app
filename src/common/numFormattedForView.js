export default function numFormattedForView(num) {
  const hour = num.slice(0, num.indexOf(":") + 1)
  const suffix = parseFloat(hour) < 12 ? "AM" : "PM"
  return `${num} ${suffix}`
}
