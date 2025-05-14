fetch('database.txt').then((_database) => {
    _database.text().then((database) => {
        table = document.querySelector('table')
        let i = 1;
        database.split('\n').forEach((elem) => {
            if(elem === '') return
            e = parseElement(i, elem.trim())
            console.log(e)
            setElement(e, table)
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
        period: elem[0]-0,
        group: elem[1]-0,
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

function setCellContent(table, rowIndex, colIndex, content) {
    if (rowIndex < 0 || rowIndex >= table.rows.length) return;
    const row = table.rows[rowIndex];
    if (colIndex < 0 || colIndex >= row.cells.length) return;
    row.cells[colIndex].innerHTML = content;
}

function setElement(element, table){
    setCellContent(table, element.period, element.group, `
        <div class="element ${element.type} ${(element.type === 'd' || element.type === 'f') ? 'b' : 'a'}">
            <div class="charge">${element.charge}</div>
            <div class="letter">${element.letter}</div>
            <div class="name">${element.name}</div>
            <div class="mass">${element.mass}</div>
            <div class="electronegativity">${element.electronegativity}</div>
            <div class="atomic-radius">${element.atomicRadius}</div>
            <div class="ionization-energy">${element.ionizationEnergy}</div>
            <div class="electron-affinity">${element.electronAffinity} ${element.electronAffinity === '-' ? '' : 'eV'}</div>
            <div class="electronic-configuration">${element.electronicConfiguration}</div>
            <ul class="electron-distribution">${element.electronDistribution.map(e => `<li>${e}</li>`).join('')}</ul>
        </div>
    `)
}


const supMap = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9'
};
function parseElectronConfiguration(ec){
    let configuration = []
    for(let i = 0; i < ec.length; i++){
        if(!isNaN(ec[i]-0)){
            if(configuration.length < ec[i]-0) configuration.push([])
            configuration[ec[i]-1].push({
                type: NaN,
                count: NaN
            })
        }else if(!Object.keys(supMap).includes(ec[i])){
            if(typeof configuration[ec[i-1]-1] !== 'undefined'){
                console.log(configuration[ec[i-1]-1][configuration[ec[i-1]-1].length-1])
                configuration[ec[i-1]-1][configuration[ec[i-1]-1].length-1].type = ec[i]
            }
        }else{
            count = ''
            j = i
            while(Object.keys(supMap).includes(ec[j])){
                count += supMap[ec[j]]
                j++
            }
            console.log(count)
            j--
            if(typeof configuration[ec[i-2]-1] !== 'undefined'){
                console.log(1, configuration[ec[i-2]-1][configuration[ec[i-2]-1].length-1])
                configuration[ec[i-2]-1][configuration[ec[i-2]-1].length-1].count = count-0
            }
            i = j
        }
    }
    return configuration
};
console.log(parseElectronConfiguration('1s²2s²2p⁶3s²3p⁶'))