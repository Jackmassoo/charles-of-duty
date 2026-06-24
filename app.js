async function loadGame() {

    const { data, error } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .limit(1);

    if(error){
        console.error(error);
        return;
    }

    const game = data[0];

    document.getElementById("bullets").innerText =
        `${game.current_bullets} / ${game.max_bullets}`;

    document.getElementById("teammates").innerText =
        `${game.current_teammates} / ${game.max_teammates}`;

    const percent =
    Math.round(
        (game.current_bullets / game.max_bullets) * 100
    );

    document.getElementById("progress").innerText =
        `${percent}%`;

}

loadGame();
