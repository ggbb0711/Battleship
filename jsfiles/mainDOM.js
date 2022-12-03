const {startCo_opgame}= require('./co-opmode');
const {startAI_game}= require('./AI.js');
startCo_opgame();

document.querySelector('#change-mode-btn').addEventListener('click',changeMode);

function changeMode(){
    let change_mode_btn=document.querySelector('#change-mode-btn');
    if(change_mode_btn.textContent==='Co-op mode'){
        startCo_opgame();
        document.querySelector('#change-mode-btn').textContent='AI mode';
        return
    }
    if(change_mode_btn.textContent==='AI mode'){
        startAI_game()
        document.querySelector('#change-mode-btn').textContent='Co-op mode';
        return
    }
}