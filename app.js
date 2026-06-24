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

    document.getElementById("progress-bar").style.width =
        `${Math.min(percent,100)}%`;

    updateLevel(game.current_bullets);

    loadMissionStats();

    checkAchievements(game);

}

function updateLevel(bullets){

    let level = "";

    if(bullets === 0)
        level = "Fêtard du 13 Février";

    else if(bullets <= 20)
        level = "Général du Célibat";

    else if(bullets <= 40)
        level = "Sergent des EVG";

    else if(bullets <= 60)
        level = "Capitaine des Promesses Éternelles";

    else if(bullets <= 80)
        level = "Commandant des Témoins";

    else if(bullets <= 100)
        level = "Maréchal des Alliances";

    else if(bullets <= 120)
        level = "Seigneur des Noces";

    else if(bullets <= 150)
        level = "Légende Vivante du Mariage";

    else if(bullets <= 180)
        level = "Charles of Duty";

    else if(bullets < 200)
        level = "Carlito l'Immortel";

    else
        level = "Élu Suprême des Mariés";

    document.getElementById("level").innerText =
        level;

}

async function loadMissionStats() {

    const { data, error } =
    await supabaseClient
    .from('missions')
    .select('validated');

    if(error){
        console.error(error);
        return;
    }

    const total = data.length;

    const completed =
        data.filter(
            mission => mission.validated === true
        ).length;

    document.getElementById("missions-count").innerText =
        `${completed} / ${total}`;

}

async function checkAchievements(game){

    const { data: achievements } =
    await supabaseClient
    .from('achievements')
    .select('*');

    const { data: missions } =
    await supabaseClient
    .from('missions')
    .select('validated');

    const completedMissions =
        missions.filter(
            m => m.validated === true
        ).length;

    for(const achievement of achievements){

        let unlocked = false;

        switch(achievement.title){

            case "Première Victoire":
                unlocked = completedMissions >= 1;
                break;

            case "Recrue Confirmée":
                unlocked = completedMissions >= 5;
                break;

            case "Héros Local":
                unlocked = completedMissions >= 10;
                break;

            case "Arsenal Léger":
                unlocked = game.current_bullets >= 50;
                break;

            case "Arsenal Lourd":
                unlocked = game.current_bullets >= 100;
                break;

            case "Arsenal de Rambo":
                unlocked = game.current_bullets >= 150;
                break;

            case "Escouade Complète":
                unlocked = game.current_teammates >= 4;
                break;

            case "Légende de l'EVG":
                unlocked = game.current_bullets >= 200;
                break;

        }

        if(unlocked && !achievement.unlocked){

            await supabaseClient
            .from('achievements')
            .update({
                unlocked: true
            })
            .eq('id', achievement.id);

        }

    }

    loadAchievements();

}

async function loadAchievements(){

    const { data } =
    await supabaseClient
    .from('achievements')
    .select('*');

    const unlocked =
        data.filter(
            a => a.unlocked === true
        ).length;

    document.getElementById(
        "achievements-count"
    ).innerText = unlocked;

}

loadGame();
