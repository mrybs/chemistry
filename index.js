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
            <div class="letter">${element.letter}</div>
            <div class="name">${element.name}</div>
            <div class="mass">${element.mass}</div>
            <div class="charge">${element.charge}</div>
            <div class="electronegativity">${element.electronegativity}</div>
            <div class="atomic-radius">${element.atomicRadius}</div>
            <div class="ionization-energy">${element.ionizationEnergy}</div>
            <div class="electron-affinity">${element.electronAffinity} ${element.electronAffinity === '-' ? '' : 'eV'}</div>
            <div class="electronic-configuration">${element.electronicConfiguration}</div>
            <ul class="electron-distribution">${element.electronDistribution.map(e => `<li>${e}</li>`).join('')}</ul>
        </div>
    `)
}
