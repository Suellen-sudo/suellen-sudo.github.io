/**
 * salvar
 * Salva os dados do formulário na collection do Firebase
 * @param {object} event - Evento do objeto que foi clicado
 * @param {string} collection - Nome da collection que será salva no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function salvar(event, collection){
    event.preventDefault() // evita que o formulário seja recarregado
    //Verificando os campos obrigatórios
    if(document.getElementById('nomeAluno').value === '') { alert('⚠ É obrigatório informar o nome!')}
    else if(document.getElementById('nomeCurso').value === '') { alert('⚠ É obrigatório informar o curso!')}
    else if(document.getElementById('dataNascimento').value === '') { alert('⚠ É obrigatório informar a data de Nascimento!')}
    else if( !(document.getElementById('gridCheckBasico').checked  ||
            document.getElementById('gridCheckIntermediario').checked  ||
            document.getElementById('gridCheckAvancado').checked )) { alert('⚠ É obrigatório informar pelo menos um nível!')}
    else if (document.getElementById('id').value !==''){
        alterar(event,collection)
    }else {incluir(event, collection)}
}

function incluir(event, collection){
    event.preventDefault() // evita que o formulário seja recarregado
    //Obtendo os campos do formulário
    const form = document.forms[0]
    const data = new FormData(form)
    //Obtendo os valores dos campos
    const values = Object.fromEntries(data.entries())
    console.log(`Os dados são:`)
    console.log(values)
    //O retorno é uma Promise (promessa)
   return firebase.database().ref(collection).push(values)
    .then(()=> {
        alert('✔ Registro cadastrado com sucesso!')
        document.getElementById('formCadastro').reset() //limpar o formulário
    })
    .catch(error => {
        console.error(`Ocorreu um erro: ${error.code}-${error.message}`)
        alert(` Falha ao incluir: ${error.message}`)
    })
}

/**
 * obtemDados.
 * Obtém os dados da collection a partir do Firebase.
 * @param {string} collection - Nome da Collection no Firebase
 * @return {object} - Uma tabela com os dados obtidos
 */
function obtemDados(collection){
    var tabela = document.getElementById('tabelaDados')
    firebase.database().ref(collection).on('value', (snapshot) => {
        tabela.innerHTML = ''
        let cabecalho = tabela.insertRow()
        cabecalho.className = 'table-info'
        cabecalho.insertCell().textContent = 'Nome'
        cabecalho.insertCell().textContent = 'Nascimento'
        cabecalho.insertCell().textContent = 'Curso'
        cabecalho.insertCell().textContent = 'Níveis'
        cabecalho.insertCell().textContent = 'Observação'
        cabecalho.insertCell().textContent = 'Ações'

        snapshot.forEach(item => {
            
            //Dados do Firebase
            let db = item.ref.path.pieces_[0] //collection
            let id = item.ref.path.pieces_[1] //id
            let registro = JSON.parse(JSON.stringify(item.val()))

            //Criando as novas linhas na tabela
            let novalinha = tabela.insertRow()
            novalinha.insertCell().textContent = item.val().nome
            novalinha.insertCell().textContent = new Date(item.val().dataNascimento).toLocaleDateString()
            novalinha.insertCell().textContent = item.val().nomeCurso

            let nivel_label = []
            if(item.val().chkBasico)
                nivel_label.push('Básico')    
            if(item.val().chkIntermediario)
                nivel_label.push('Intemediário')
            if(item.val().chkAvancado)
                nivel_label.push('Avançado')
            
            novalinha.insertCell().textContent = nivel_label.join(' | ')
            novalinha.insertCell().textContent = item.val().txtObs || ''

            novalinha.insertCell().innerHTML = 
            `
            <button class ='btn btn-danger' title='Remove o registro corrente' onclick=remover('${db}','${id}')><i class='bi bi-trash3'></i> Excluir </button>
            <button class ='btn btn-warning' title='Edita o registro corrente' onclick=carregaDadosAlteracao('${db}','${id}')><i class='bi bi-pencil-square'></i> Editar </button>
            `
        })
        let rodape = tabela.insertRow()
        rodape.className = 'table-primary'
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().innerHTML = totalRegistros(collection)

    })
}

/** 
 * totalRegistros.
 * Retorna a contagem total do número de registros da collection informada
 * @param {string} collection - Nome da Collection no Firebase
 * @return {string} - Texto com o total de registros
* */
function totalRegistros(collection){
    var retorno = '...'
    firebase.database().ref(collection).on('value', (snapshot) => {
        if (snapshot.numChildren() === 0) {
            retorno = '‼ Ainda não há nenhum registro cadastrado!'
        } else {
            retorno = `Total de Registros: ${snapshot.numChildren()}`
        }
    })
    return retorno
}
/**
 * @param {String} id
 * @param {String} db
 * @return {null}
 */
    

function remover (db, id){
if (window.confirm('🔴Confirma a excluão do registro? ')){
    let dadoExclusao = firebase.database().ref().child(db+'/'+ id)
    dadoExclusao.remove()
    .then(()=>{ 
        alert('✅Registro removido com sucesso!')
    })
    .catch(error =>{
        alert('❌ Falha ao excluir: '+ error.mensage)
    })
}
}

function carregaDadosAlteracao(db,id){
    firebase.database().ref(db).on('value', (snapshot)=>{

        snapshot.forEach (item => {
            if (item.ref.path.pieces_[1] === id){
                //Se for igual ao ID, iremos igualar os campos
                document.getElementById('id').value = item.ref.path.pieces_[1]
                document.getElementById('nomeAluno').value = item.val().nome
                document.getElementById('dataNascimento').value = item.val().dataNascimento

                document.getElementById('gridCheckBasico').checked = item.val().chkBasico ? true : false
                document.getElementById('gridCheckIntermediario').checked = item.val().chkIntermediario ? true : false
                document.getElementById('gridCheckAvancado').checked = item.val().chkAvancado ? true : false

                if(document.getElementById('gridRadiosManha').value == item.val().periodo )
                    document.getElementById('gridRadiosManha').checked = true
                else if(document.getElementById('gridRadiosTarde').value == item.val().periodo )
                    document.getElementById('gridRadiosTarde').checked = true
                else if(document.getElementById('gridRadiosNoite').value == item.val().periodo )
                    document.getElementById('gridRadiosNoite').checked = true
            
                document.getElementById('nomeCurso').value = item.val().nomeCurso
                document.getElementById('areaTexto').value = item.val().txtObs || ''
            }
        })

    })
}

function alterar(event, collection) {
    event.preventDefault()
    //Obtendo os campos do formulário
    const form = document.forms[0];
    const data = new FormData(form);
    //Obtendo os valores dos campos
    const values = Object.fromEntries(data.entries());
    console.log(values)
    console.log(data.entries())
    let aluno = {
        nome: values['nome'],
        dataNascimento: values['dataNascimento'],
        chkBasico: number(values['gridCheckbasico']),
        chkIntermediario: number(values['chkIntermediario']),
        chkAvancado:number(values['gridCheckAvancado']),
        periodo: values['periodo'],
        nomeCurso: values['nomeCurso'],
        txtObs: values['areaTexto']
    }
    //Enviando os dados dos campos para o Firebase
    return firebase.database().ref().child(collection + '/' + values.id).update(aluno)
      .then(() => {
        alert('✅ Registro alterado com sucesso!')
        document.getElementById('formCadastro').reset()
      })
      .catch(error => {
        console.log(error.code)
        console.log(error.message)
        alert('❌ Falha ao alterar: ' + error.message)
      })
  }
