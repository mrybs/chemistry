var elements = []


fetch('psce.csv').then((_database) => {
    function parseElement(charge, e){
        elem = e.split(',');
        return {
            period: elem[0]-0,
            group: elem[1]-0,
            type: elem[2],
            charge: charge,
            letter: capitalizeFirstLetter(elem[3]),
            name: elem[4].toUpperCase(),
            mass: elem[5] - 0,
            electronegativity: elem[6] - 0,
            atomicRadius: elem[7] - 0,
            ionizationEnergy: elem[8] - 0,
            electronAffinity: elem[9] - 0,
            electronicConfiguration: elem[10],
        }
    }

    _database.text().then((database) => {
        table = document.querySelector('table')
        let i = 1;
        let lines = database.split('\n')
        elements = []
        lines.slice(1).forEach((elem) => {
            if(elem === '') return
            e = parseElement(i, elem.trim())
            elements.push(e)
            console.log(e)
            
            i++
        })
        for(let i = 0; i < elements.length; i++){
            elements[i].electronDistribution = configurationToElectronicDistribution(parseElectronConfiguration(getFullElectronConfiguration(elements[i].charge)))
            setElement(elements[i], table)
        }
    })
})

function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
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
            <div class="electronegativity">${isNaN(element.electronegativity) ? '-' : element.electronegativity}</div>
            <div class="atomic-radius">${element.atomicRadius}</div>
            <div class="ionization-energy">${element.ionizationEnergy}</div>
            <div class="electron-affinity">${isNaN(element.electronAffinity) ? '-' : element.electronAffinity + ' eV'}</div>
            <div class="electronic-configuration">${element.electronicConfiguration}</div>
            <ul class="electron-distribution">${element.electronDistribution.map(e => `<li>${e}</li>`).join('')}</ul>
        </div>
    `)
}


const supMap = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9'
};

function getFullElectronConfiguration(charge){
    function getElementInBrackets(str) {
        const match = str.match(/^\[(\w+)\]/);
        return match ? match[1] : null; 
    }

    for(let i = 0; i < elements.length; i++){
        if(elements[i].charge === charge){ 
            let eib = getElementInBrackets(elements[i].electronicConfiguration)
            if(eib === null) return elements[i].electronicConfiguration
            for(let j = 0; j < elements.length; j++){
                if(elements[j].letter === eib){ 
                    return elements[i].electronicConfiguration.replace(`[${eib}]`, getFullElectronConfiguration(elements[j].charge))
                }
            }
        }
    }
}

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

function configurationToElectronicDistribution(configuration){
    return configuration.map((level) => level.map((orb) => orb.count).reduce((s, a) => s + a, 0)).reverse()
}
