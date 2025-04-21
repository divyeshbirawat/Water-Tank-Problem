        document.addEventListener('DOMContentLoaded', function() {
            const heightInput = document.getElementById('height');
            const calculateBtn = document.getElementById('calculate');
            const randomBtn = document.getElementById('random');
            const waterUnitsDisplay = document.getElementById('water-units');
            const visualization = document.getElementById('graph-container');

            calculateBtn.addEventListener('click', calculateWater);
            randomBtn.addEventListener('click', generateRandom);
            
            function calculateWater() {
                const heights = heightInput.value.split(',')
                    .map(item => parseInt(item.trim()))
                    .filter(num => !isNaN(num) && num >= 0);
                    
                if (heights.length === 0) {
                    alert("Please enter valid positive numbers separated by commas");
                    return;
                }
                
                const waterUnits = trapWater(heights);
                waterUnitsDisplay.textContent = waterUnits;
                visualize(heights, waterUnits);
            }
            
            function generateRandom() {
                const randomLength = Math.floor(Math.random() * 10) + 5;
                const randomHeights = [];
                
                for (let i = 0; i < randomLength; i++) {
                    randomHeights.push(Math.floor(Math.random() * 5));
                }
                
                heightInput.value = randomHeights.join(',');
                calculateWater();
            }
            
            function trapWater(height) {
                if (height.length === 0) return 0;
                
                let left = 0;
                let right = height.length - 1;
                let leftMax = 0;
                let rightMax = 0;
                let water = 0;
                
                while (left < right) {
                    if (height[left] < height[right]) {
                        if (height[left] >= leftMax) {
                            leftMax = height[left];
                        } else {
                            water += leftMax - height[left];
                        }
                        left++;
                    } else {
                        if (height[right] >= rightMax) {
                            rightMax = height[right];
                        } else {
                            water += rightMax - height[right];
                        }
                        right--;
                    }
                }
                
                return water;
            }
            
            function visualize(heights, waterUnits) {
                visualization.innerHTML = '';
                
                if (heights.length === 0) return;
                
                const maxHeight = Math.max(...heights);
                const scaleFactor = 250 / (maxHeight || 1);
                
                for (let i = 0; i < heights.length; i++) {
                    const blockHeight = heights[i];
                    const blockContainer = document.createElement('div');
                    blockContainer.className = 'flex flex-col items-center';
                    
                    const blockElement = document.createElement('div');
                    blockElement.className = 'block w-8 bg-gray-700 relative';
                    blockElement.style.height = `${blockHeight * scaleFactor}px`;

                    const leftMax = Math.max(...heights.slice(0, i + 1));
                    const rightMax = Math.max(...heights.slice(i));
                    const waterLevel = Math.min(leftMax, rightMax);
                    const waterHeight = waterLevel - blockHeight;
                    
                    if (waterHeight > 0) {
                        const waterElement = document.createElement('div');
                        waterElement.className = 'water absolute bottom-0 w-full bg-blue-500';
                        waterElement.style.height = `${waterHeight * scaleFactor}px`;
                        blockElement.appendChild(waterElement);
                    }
                    
                    const valueLabel = document.createElement('div');
                    valueLabel.className = 'text-xs font-bold mt-1';
                    valueLabel.textContent = blockHeight;
                    
                    blockContainer.appendChild(blockElement);
                    blockContainer.appendChild(valueLabel);
                    visualization.appendChild(blockContainer);
                }
            }
        });