async function loadLog(){

    const { data, error } =
    await supabaseClient
    .from('war_log')
    .select('*');

    if(error){
        console.error(error);
        return;
    }

    const container =
    document.getElementById('log-list');

    container.innerHTML = '';

    data.forEach(entry => {

        const card =
        document.createElement('div');

        card.className = 'card';

        card.innerHTML = `
            <h3>${entry.author}</h3>
            <p>${entry.action}</p>
            <p>${entry.note}</p>
        `;

        container.appendChild(card);

    });

}

loadLog();
