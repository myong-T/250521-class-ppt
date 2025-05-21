document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideNumberDisplay = document.getElementById('slide-number');
    let currentSlide = 0;

    function updateSlideDisplay() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        slideNumberDisplay.textContent = `${currentSlide + 1} / ${slides.length}`;
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slides.length - 1;
    }

    nextBtn.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlideDisplay();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlideDisplay();
        }
    });

    // PMI Table reveal buttons (Slide 6)
    const tableRevealBtns = document.querySelectorAll('.pmi-table .reveal-btn');
    tableRevealBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const column = btn.dataset.column;
            const tableType = btn.dataset.table;
            const cells = document.querySelectorAll(`.${column}-${tableType}`);
            cells.forEach(cell => cell.classList.toggle('hidden-cell'));
            btn.textContent = cells[0].classList.contains('hidden-cell') ? '보이기' : '숨기기';
        });
    });
    
    // Idea reveal buttons (Slide 7)
    const revealPeperoIdeasBtn = document.getElementById('revealPeperoIdeas');
    if(revealPeperoIdeasBtn){
        revealPeperoIdeasBtn.addEventListener('click', () => {
            const ideaItems = document.querySelectorAll('#slide7 .idea-item');
            ideaItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.remove('hidden-idea');
                }, index * 200); // Staggered reveal
            });
            revealPeperoIdeasBtn.style.display = 'none'; // Hide button after reveal
        });
    }

    // Inline reveal buttons (Slide 8, 9)
    const inlineRevealBtns = document.querySelectorAll('.reveal-btn-inline');
    inlineRevealBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.style.display = targetElement.style.display === 'none' || targetElement.style.display === '' ? 'inline' : 'none';
                btn.textContent = targetElement.style.display === 'none' ? '아이디어 보기' : '숨기기';
            }
        });
    });

    // D3.js for PMI Components (Slide 4)
    if (document.getElementById('slide4')) {
        const pmiData = [
            { id: 'P', name: 'Plus (장점)', color: '#5cb85c', description: "아이디어의 좋은 점, 강점, 유리한 점.<br><strong>키워드:</strong> 장점, 좋은 점, 편리한 점, 독특한 점" },
            { id: 'M', name: 'Minus (단점)', color: '#d9534f', description: "아이디어의 나쁜 점, 약점, 불리한 점, 문제점.<br><strong>키워드:</strong> 단점, 나쁜 점, 불편한 점, 불가능한 점" },
            { id: 'I', name: 'Interesting (흥미로운 점)', color: '#f0ad4e', description: "아이디어 자체는 좋거나 나쁘지 않지만, 흥미를 끄는 점, 더 생각해 볼 점, 새로운 가능성.<br><strong>키워드:</strong> 흥미로운 점, 재미있는 점, 더 생각해볼 점" }
        ];

        const svgWidth = 600;
        const svgHeight = 150;
        const svg = d3.select("#pmi-components-visualization")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("display", "block")
            .style("margin", "0 auto");

        const pmiExplanationDiv = d3.select("#pmi-explanation");

        const circles = svg.selectAll("g")
            .data(pmiData)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(${(i * (svgWidth / 3)) + (svgWidth / 6)}, ${svgHeight / 2})`)
            .style("cursor", "pointer")
            .on("click", function(event, d) {
                pmiExplanationDiv.html(`<strong>${d.name}:</strong> ${d.description}`);
                circles.selectAll("circle").attr("r", 40).style("stroke-width", "2px"); // Reset other circles
                d3.select(this).select("circle").transition().duration(200).attr("r", 50).style("stroke-width", "4px");
            })
            .on("mouseover", function() {
                d3.select(this).select("circle").transition().duration(100).attr("r", d3.select(this).select("circle").attr("r") === "50" ? 50: 45);
            })
            .on("mouseout", function() {
                 d3.select(this).select("circle").transition().duration(100).attr("r", d3.select(this).select("circle").attr("r") === "50" ? 50: 40);
            });

        circles.append("circle")
            .attr("r", 40)
            .style("fill", d => d.color)
            .style("stroke", d => d3.rgb(d.color).darker(0.5))
            .style("stroke-width", "2px");

        circles.append("text")
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .style("fill", "white")
            .style("font-size", "24px")
            .style("font-weight", "bold");
            
        pmiExplanationDiv.html("각 원을 클릭하여 설명을 보세요!");
    }

    updateSlideDisplay(); // Initialize first slide
});
