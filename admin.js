async function addBullets(amount) {

    const { data } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    let newValue =
        data.current_bullets + amount;

    if (newValue < 0) {
        newValue = 0;
    }

    await supabaseClient
    .from('game_settings')
    .update({
        current_bullets: newValue
    })
    .eq('id', data.id);

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: amount > 0
            ? "Ajout de billes"
            : "Retrait de billes",
        note: `${amount > 0 ? '+' : ''}${amount} billes`
    });

    alert("Billes mises à jour");

}

async function addTeammate(amount) {

    const { data } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    let newValue =
        data.current_teammates + amount;

    if (newValue < 0) {
        newValue = 0;
    }

    await supabaseClient
    .from('game_settings')
    .update({
        current_teammates: newValue
    })
    .eq('id', data.id);

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: amount > 0
            ? "Ajout de coéquipier"
            : "Retrait de coéquipier",
        note: `${amount > 0 ? '+' : ''}${amount} coéquipier`
    });

    alert("Coéquipiers mis à jour");

}
async function setBullets() {

    const value =
        parseInt(
            document.getElementById(
                "bullets-value"
            ).value
        );

    if(isNaN(value)){
        alert("Valeur invalide");
        return;
    }

    const { data } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    await supabaseClient
    .from('game_settings')
    .update({
        current_bullets: value
    })
    .eq('id', data.id);

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: "Modification des billes",
        note: `${value} billes`
    });

    alert("Billes mises à jour");

}

async function setTeammates() {

    const value =
        parseInt(
            document.getElementById(
                "teammates-value"
            ).value
        );

    if(isNaN(value)){
        alert("Valeur invalide");
        return;
    }

    const { data } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    await supabaseClient
    .from('game_settings')
    .update({
        current_teammates: value
    })
    .eq('id', data.id);

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: "Modification des coéquipiers",
        note: `${value} coéquipiers`
    });

    alert("Coéquipiers mis à jour");

}

async function createBonusMission() {

    const title =
        document.getElementById("bonus-title").value;

    const reward =
        parseInt(
            document.getElementById("bonus-reward").value
        );

    const rewardType =
        document.getElementById("bonus-type").value;

    if(!title || isNaN(reward)){
        alert("Complète tous les champs");
        return;
    }

    const category =
        rewardType === "bullets"
        ? `${reward}_billes`
        : "recrutement";

    const { error } =
    await supabaseClient
    .from('missions')
    .insert({
        title: title,
        category: category,
        reward: reward,
        reward_type: rewardType,
        validated: false,
        is_bonus: true
    });

    if(error){
        console.error(error);
        alert("Erreur création mission");
        return;
    }

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: "Mission bonus créée",
        note: title
    });

    alert("Mission bonus créée");

    location.reload();

}
let currentMissionId = null;

loadMissionEditor();

async function loadMissionEditor() {

    const { data } =
    await supabaseClient
    .from('missions')
    .select('*')
    .order('title');

    const select =
        document.getElementById(
            "edit-mission-select"
        );

    select.innerHTML = "";

    data.forEach(mission => {

        const option =
            document.createElement("option");

        option.value = mission.id;
        option.textContent = mission.title;

        select.appendChild(option);

    });

    if(data.length > 0){

        loadMission(data[0].id);

    }

    select.addEventListener(
        "change",
        function(){

            loadMission(this.value);

        }
    );

}

async function loadMission(id){

    const { data } =
    await supabaseClient
    .from('missions')
    .select('*')
    .eq('id', id)
    .single();

    currentMissionId = id;

    document.getElementById(
        "edit-title"
    ).value = data.title;

    document.getElementById(
        "edit-reward"
    ).value = data.reward;

    document.getElementById(
        "edit-type"
    ).value = data.reward_type;

}

async function saveMission(){

    const title =
        document.getElementById(
            "edit-title"
        ).value;

    const reward =
        parseInt(
            document.getElementById(
                "edit-reward"
            ).value
        );

    const rewardType =
        document.getElementById(
            "edit-type"
        ).value;

    let category;

    if(rewardType === "bullets"){

        category =
            reward + "_billes";

    }else{

        category =
            "recrutement";

    }

    const { error } =
    await supabaseClient
    .from('missions')
    .update({
        title: title,
        reward: reward,
        reward_type: rewardType,
        category: category
    })
    .eq('id', currentMissionId);

    if(error){

        console.error(error);

        alert(
            "Erreur modification mission"
        );

        return;

    }

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: "Mission modifiée",
        note: title
    });

    alert(
        "Mission mise à jour"
    );

    loadMissionEditor();

}

async function loadValidatedMissions(){

    const { data } =
    await supabaseClient
    .from('missions')
    .select('*')
    .eq('validated', true)
    .order('title');

    let html = "";

    data.forEach(mission => {

        html += `
            <div style="margin-bottom:10px;">

                ${mission.title}

                <br>

                <button
                    onclick="reactivateMission('${mission.id}')">

                    Réactiver

                </button>

            </div>
        `;

    });

    document.getElementById(
        "validated-list"
    ).innerHTML = html;

}

async function reactivateMission(id){

    const { data } =
    await supabaseClient
    .from('missions')
    .select('*')
    .eq('id', id)
    .single();

    await supabaseClient
    .from('missions')
    .update({
        validated: false,
        validated_by: null
    })
    .eq('id', id);

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: "Mission réactivée",
        note: data.title
    });

    alert(
        "Mission réactivée"
    );

    loadValidatedMissions();

}

async function loadBonusMissions(){

    const { data } =
    await supabaseClient
    .from('missions')
    .select('*')
    .eq('is_bonus', true)
    .order('title');

    let html = "";

    data.forEach(mission => {

        html += `
            <div style="margin-bottom:10px;">

                ${mission.title}

                <br>

                <button
                    onclick="deleteBonusMission('${mission.id}')">

                    Supprimer

                </button>

            </div>
        `;

    });

    document.getElementById(
        "bonus-list"
    ).innerHTML = html;

}

async function deleteBonusMission(id){

    const { data } =
    await supabaseClient
    .from('missions')
    .select('*')
    .eq('id', id)
    .single();

    if(
        !confirm(
            `Supprimer "${data.title}" ?`
        )
    ){
        return;
    }

    await supabaseClient
    .from('missions')
    .delete()
    .eq('id', id);

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: "Mission bonus supprimée",
        note: data.title
    });

    alert(
        "Mission supprimée"
    );

    loadBonusMissions();

}
