async function addBullets(amount){

    const { data } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    let newValue =
        data.current_bullets + amount;

    if(newValue < 0){
        newValue = 0;
    }

    await supabaseClient
    .from('game_settings')
    .update({
        current_bullets: newValue
    })
    .eq('id', data.id);

    alert("Billes mises à jour");

}

async function addTeammate(amount){

    const { data } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    let newValue =
        data.current_teammates + amount;

    if(newValue < 0){
        newValue = 0;
    }

    await supabaseClient
    .from('game_settings')
    .update({
        current_teammates: newValue
    })
    .eq('id', data.id);

    alert("Coéquipiers mis à jour");

}
