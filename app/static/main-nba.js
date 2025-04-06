
document.addEventListener("DOMContentLoaded", event=>{
    const form=document.querySelector('form')
   


     form.addEventListener("submit", (event)=>{
        event.preventDefault();// preventing reloading bc its annoying LOL
        const opponent = document.getElementById('opponent').value;
        const searchType = document.getElementById('type').value;
        const stat_line = document.getElementById('stat_line').value;
        const player = document.getElementById('player').value;   
      


        if (!searchType) {
            alert('Please select a search type.');
            return;
        }

       /* if (!searchQuery) {
            alert('Please select a search type.');
            return;
        }*/

    send_to_function(opponent, searchType, stat_line,player);
    });
    
   
    
});

function send_to_function(opponent, searchType, stat_line,player) {
    //event.preventDefault();

    let results = document.getElementById("results");
    results.innerHTML = "";

    let data = {
        opponent: opponent,
        type: searchType,
        stat_line: stat_line,
        player,player


    };

//---------------------------------------------//


//-----------------------------------------------//
    fetch("/input", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Send data as JSON
        },
        body: JSON.stringify(data) // Convert the data object to JSON string
    })
    .then(response => response.json())
    .then(result => {
        console.log("Response from backend:", result);
     
        const container = document.getElementById('chartContainer');
        container.innerHTML = '';
        show_chart(container, result.prob_under,result.prob_over);
        
        
            
        // Create the table element here instead
        let table = document.createElement("table");
        
        const stats = [
      
            ["Opponent Average", result.opponent_avg],
            ["Recent Average", result.recent_avg],
            ["Season Average", result.season_avg],
            ["Probability Over", result.prob_over],
            ["Probability Under", result.prob_under],
            ["Note", result.note]
        ];
    
        stats.forEach(([label, value]) => {
            let row = document.createElement("tr");
            row.classList.add("stat-result");
            row.innerHTML = `
                <td class="stat-label">${label}:</td>
                <td class="stat-value">${value}</td>
            `;
            table.appendChild(row);
        });
        
        // Now append the complete table to results
        results.appendChild(table);
        console.log("under append child");
        console.log(result.prob_over);
        console.log(  result.prob_under);
    })
    .catch(error => {
        console.error("Error:", error);
        results.innerHTML = `<p>Error fetching stats: ${error}</p>`;
    });
    

}

function show_chart(parent,prob_under, prob_over){
    const canvas=document.createElement('canvas');
   

    parent.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Probability Under', 'Probability Over'],
          datasets: [{
            label: 'LeData',
            data: [prob_under, prob_over], // Data values for each bar
            backgroundColor: [
                'rgba(255, 0, 0, 0.7)', // Red for "Probability Under"
                'rgba(0, 0, 255, 0.7)'  // Blue for "Probability Over"
            ],
            borderColor: [
                'rgba(255, 0, 0, 1)', // Border color for red
                'rgba(0, 0, 255, 1)'  // Border color for blue
            ],
            borderWidth: 1
        }]
    },

        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
   
      myChart.update(); 

}

