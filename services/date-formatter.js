const formatHours = (hours, remainder) => {
  if (hours === '12' && remainder === 'AM')
    return hours - 12
  if (hours !== '12' && remainder === 'PM')
    return parseInt(hours) + 12
  return hours
}

module.exports = {
  getDate (dateString) {
    const [ month, day, rest ] = dateString.split('/')
    const [ year, time ] = rest.split(', ')
    const [current, remainder ] = time.split(' ')
    const [ hours, minutes ] = current.split(':')
    return `${day}/${month}/${year}, ${formatHours(hours, remainder)}:${minutes}`
  }
}