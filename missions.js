console.log("VERSION 2");
async function loadMissions() {

    const { data, error } =
    await supabaseClient
    .from('missions')
    .select('*')
    .eq('validated', false)
    .order('reward', { ascending: true });

    if (error) {
        console.error(error);
        return;
    }
console.log(data);
    const container =
    document.getElementById("missions-list");

    container.innerHTML = "";

    data.forEach(mission => {

        const card =
        document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${mission.title}</h3>

            <p>
                Récompense :
                +${mission.reward}
                ${
                    mission.reward_type === 'bullets'
                    ? 'billes'
                    : 'coéquipier'
                }
            </p>

            <button onclick="validateMission('${mission.id}')">
                Valider
            </button>
        `;

        container.appendChild(card);

    });

}

async function validateMission(id) {

    const witness = prompt(
        "Qui valide cette mission ?"
    );

    if (!witness) return;

    const { data: mission } =
    await supabaseClient
    .from('missions')
    .select('*')
    .eq('id', id)
    .single();

    if (!mission) return;

    if (mission.validated) {

        alert("Mission déjà validée !");

        return;

    }

    await supabaseClient
    .from('missions')
    .update({
        validated: true
    })
    .eq('id', id);

    const { data: game } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    if (mission.reward_type === "bullets") {

        await supabaseClient
        .from('game_settings')
        .update({
            current_bullets:
                game.current_bullets +
                mission.reward
        })
        .eq('id', game.id);

    }

    if (mission.reward_type === "teammate") {

        await supabaseClient
        .from('game_settings')
        .update({
            current_teammates:
                game.current_teammates +
                mission.reward
        })
        .eq('id', game.id);

    }

    await supabaseClient
    .from('war_log')
    .insert({
        author: witness,
        action: mission.title,
        note: `+${mission.reward} ${
            mission.reward_type === 'bullets'
                ? 'billes'
                : 'coéquipier'
        }`
    });

    alert("Mission validée !");

    loadMissions();

}

loadMissions();
