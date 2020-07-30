import addSeconds from "date-fns/addSeconds"
import format from "date-fns/format"
import fromUnixTime from "date-fns/fromUnixTime"
import isFuture from "date-fns/isFuture"

export const shortenAccount = (account: string): string =>
  account.slice(0, 4) + "..." + account.slice(account.length - 4)

const defaultNumberFormat = new Intl.NumberFormat()
export const formatNumber = (number: number): string =>
  defaultNumberFormat.format(number)

export const toShortDate = timestamp => {
  return formatDate(fromUnixTime(timestamp))
}

export const toShortDateTime = timestamp => {
  return formatDateTime(fromUnixTime(timestamp))
}

export const formatDate = date => {
  return format(date, "yyyy/MM/dd")
}

export const formatDateTime = date => {
  return format(date, "yyyy/MM/dd p")
}

export const getProposalEndDate = (createdAt, votingPhaseDuration) => {
  return addSeconds(fromUnixTime(createdAt), votingPhaseDuration)
}

export const inVotingPeriod = (createdAt, votingPhaseDuration) =>
  isFuture(getProposalEndDate(createdAt, votingPhaseDuration))

export const validMarkdownUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url)

    return /\.md$/i.test(parsedUrl.pathname)
  } catch (error) {
    return false
  }
}
