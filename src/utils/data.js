const dataHora = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const milisegundos = date.getMilliseconds()

    return `${day}_${month}_${year}_${hour}_${minutes}_${seconds}_${milisegundos}` 
}

module.exports = { dataHora } 