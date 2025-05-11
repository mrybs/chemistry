fetch('database.txt').then((_database) => {
    _database.text().then((database) => {
        let i = 1;
        database.split('\n').forEach((elem) => {
            if(elem === '') return
            console.log(parseElement(i, elem.trim()))
            i++
        })
    })
})

function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

function parseElement(charge, e){
    elem = e.split(' ');
    return {
        period: elem[0],
        group: elem[1],
        type: elem[2],
        charge: charge,
        letter: capitalizeFirstLetter(elem[3]),
        name: elem[4].toUpperCase(),
        mass: elem[5],
        electronegativity: elem[6],
        atomicRadius: elem[7],
        ionizationEnergy: elem[8],
        electronAffinity: elem[9],
        electronicConfiguration: elem[10],
        electronDistribution: elem.slice(11)
    }
}