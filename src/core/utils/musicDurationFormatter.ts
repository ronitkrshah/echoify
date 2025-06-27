import moment from "moment";

export default function musicDurationFormatter(duration: number) {
  const totalDuration = moment.utc(duration * 1000).format("HH:mm:ss");
  const splittedText = totalDuration.split(":");
  if (splittedText[0] === "00") {
    return `${splittedText[1]}:${splittedText[2]}`
  }

  return totalDuration;
}
