let backgroundImage; // 儲存背景圖片。
let character1StopSprite; // 儲存角色一的站立動畫精靈圖。
let character1WalkSprite; // 儲存角色一的走路動畫精靈圖。
let character2StopSprite; // 儲存角色二的站立動畫精靈圖。
let character2CorrectSprite; // 儲存角色二答對時的動畫精靈圖。
let character2IncorrectSprite; // 儲存角色二答錯時的動畫精靈圖。
const character1StopFrameCount = 8; // 設定角色一站立動畫的影格數量。
const character1WalkFrameCount = 6; // 設定角色一走路動畫的影格數量。
const character2StopFrameCount = 5; // 設定角色二站立精靈圖實際的五格影格數量。
const character2CorrectFrameCount = 5; // 設定角色二答對動畫的五格影格數量。
const character2IncorrectFrameCount = 7; // 設定角色二答錯動畫的影格數量。
const character1Scale = 2; // 設定角色一圖片放大倍率。
const character2Scale = 1; // 設定角色二圖片顯示倍率。
const animationFrameDelay = 8; // 設定每張動畫影格顯示的繪圖次數。
const movementSpeed = 4; // 設定角色一每次繪圖時移動的距離。
const quizQuestions = [ // 建立十題依序輪流出現的基礎加減法題庫。
  { question: '第 1 題：1 + 1 = ?', options: ['A. 1', 'B. 2', 'C. 3'], correctOptionIndex: 1 }, // 設定第一題及第二個選項為正確答案。
  { question: '第 2 題：2 + 3 = ?', options: ['A. 5', 'B. 6', 'C. 4'], correctOptionIndex: 0 }, // 設定第二題及第一個選項為正確答案。
  { question: '第 3 題：4 + 2 = ?', options: ['A. 5', 'B. 6', 'C. 7'], correctOptionIndex: 1 }, // 設定第三題及第二個選項為正確答案。
  { question: '第 4 題：5 + 3 = ?', options: ['A. 9', 'B. 7', 'C. 8'], correctOptionIndex: 2 }, // 設定第四題及第三個選項為正確答案。
  { question: '第 5 題：7 + 2 = ?', options: ['A. 8', 'B. 10', 'C. 9'], correctOptionIndex: 2 }, // 設定第五題及第三個選項為正確答案。
  { question: '第 6 題：6 - 1 = ?', options: ['A. 4', 'B. 5', 'C. 6'], correctOptionIndex: 1 }, // 設定第六題及第二個選項為正確答案。
  { question: '第 7 題：8 - 3 = ?', options: ['A. 5', 'B. 4', 'C. 6'], correctOptionIndex: 0 }, // 設定第七題及第一個選項為正確答案。
  { question: '第 8 題：9 - 4 = ?', options: ['A. 4', 'B. 6', 'C. 5'], correctOptionIndex: 2 }, // 設定第八題及第三個選項為正確答案。
  { question: '第 9 題：10 - 2 = ?', options: ['A. 7', 'B. 8', 'C. 9'], correctOptionIndex: 1 }, // 設定第九題及第二個選項為正確答案。
  { question: '第 10 題：7 - 5 = ?', options: ['A. 2', 'B. 1', 'C. 3'], correctOptionIndex: 0 }, // 設定第十題及第一個選項為正確答案。
]; // 結束十題選擇題題庫。
let character1X = 0; // 儲存角色一中心點的水平位置。
let character2X = 0; // 儲存角色二中心點的水平位置。
let facingDirection = 1; // 儲存角色一面向方向，正值為右方、負值為左方。
let character1WasMoving = false; // 記錄上一個繪圖週期角色一是否正在移動。
let character1WalkStartFrame = 0; // 記錄角色一這次走路動畫開始的繪圖週期。
let quizVisible = false; // 記錄選擇題方框目前是否顯示。
let interactionTriggered = false; // 記錄這次接近是否已經觸發過選擇題。
let interactionResult = null; // 儲存角色一作答結果，正確、錯誤或尚未作答。
let currentQuizIndex = -1; // 記錄目前題庫的題目索引，從零開始輪流出題。
let currentQuizQuestion = quizQuestions[0]; // 儲存目前要顯示並判斷答案的題目。

function preload() { // 在畫布建立前載入背景與兩個角色的動畫精靈圖。
  backgroundImage = loadImage('1/bg1.jpg'); // 載入資料夾中現有的背景圖片。
  character1StopSprite = loadImage('1/stop/stop.png'); // 載入角色一的八張站立動畫影格。
  character1WalkSprite = loadImage('1/walk/walk.png'); // 載入角色一的六張走路動畫影格。
  character2StopSprite = loadImage('2/stop/stop.png'); // 載入角色二的五張站立精靈圖影格。
  character2CorrectSprite = loadImage('2/correct/correct.png'); // 載入角色二的五張答對動畫影格。
  character2IncorrectSprite = loadImage('2/incorrect/incorrect.png'); // 載入角色二的七張答錯動畫影格。
} // 結束 preload 函式。

function setup() { // 設定全螢幕畫布與兩個角色的初始位置。
  createCanvas(windowWidth, windowHeight); // 建立符合瀏覽器視窗大小的畫布。
  imageMode(CENTER); // 讓繪製圖片時以指定座標作為圖片中心。
  textFont('sans-serif'); // 設定畫面文字使用一般無襯線字體。
  character2X = width / 3; // 將角色二固定在畫面水平位置的三分之一處。
  character1X = (width * 2) / 3; // 將角色一的初始位置設定在畫面水平位置的三分之二處。
} // 結束 setup 函式。

function draw() { // 每個繪圖週期更新背景、互動狀態、角色位置與動畫。
  image(backgroundImage, width / 2, height / 2, width, height); // 將背景圖片拉伸填滿整個畫布。
  const movingLeft = keyIsDown(LEFT_ARROW); // 檢查目前是否按住鍵盤左方向鍵。
  const movingRight = keyIsDown(RIGHT_ARROW); // 檢查目前是否按住鍵盤右方向鍵。
  const character1IsMoving = !quizVisible && (movingLeft || movingRight); // 顯示題目時暫停角色一移動，其他時候依方向鍵移動。
  if (character1IsMoving) { // 如果角色一正在移動，就更新角色方向與位置。
    facingDirection = movingLeft ? -1 : 1; // 按左鍵時面向左方，否則面向右方。
    character1X += facingDirection * movementSpeed; // 依照面向方向移動角色一。
    const character1FrameWidth = (character1WalkSprite.width / character1WalkFrameCount) * character1Scale; // 計算放大後角色一的走路影格寬度。
    const minimumCharacter1X = min(character1FrameWidth / 2, width / 2); // 計算角色一可移動到的最左側位置。
    const maximumCharacter1X = max(width - character1FrameWidth / 2, width / 2); // 計算角色一可移動到的最右側位置。
    character1X = constrain(character1X, minimumCharacter1X, maximumCharacter1X); // 限制角色一不要移出畫面左右邊界。
    if (!character1WasMoving) { // 如果角色一剛開始移動，就重新啟動走路動畫。
      character1WalkStartFrame = frameCount; // 記錄角色一走路動畫開始的繪圖週期。
    } // 結束走路動畫啟動判斷。
    character1WasMoving = true; // 記錄角色一目前正在移動。
  } else { // 如果角色一沒有移動，就重設走路狀態。
    character1WasMoving = false; // 記錄角色一目前沒有移動。
  } // 結束角色一移動狀態判斷。
  const character1Width = (character1WalkSprite.width / character1WalkFrameCount) * character1Scale; // 計算角色一放大後的顯示寬度。
  const character2Width = character2StopSprite.width / character2StopFrameCount; // 計算角色二以原尺寸顯示時的影格寬度。
  const interactionDistance = (character1Width + character2Width) / 2 + 24; // 設定兩個角色接近到影格寬度加緩衝距離時觸發互動。
  const distanceBetweenCharacters = abs(character1X - character2X); // 計算兩個角色中心點之間的水平距離。
  if (distanceBetweenCharacters > interactionDistance) { // 如果角色一已經遠離角色二，就結束這次互動。
    quizVisible = false; // 隱藏選擇題方框。
    interactionTriggered = false; // 允許角色一再次接近時重新觸發選擇題。
    interactionResult = null; // 清除上一次作答結果，讓角色二恢復站立動畫。
  } else if (!interactionTriggered) { // 如果角色一靠近且這次尚未觸發互動，就顯示選擇題。
    currentQuizIndex = (currentQuizIndex + 1) % quizQuestions.length; // 每次重新接近時切換到題庫中的下一題。
    currentQuizQuestion = quizQuestions[currentQuizIndex]; // 儲存目前輪到的題目與答案資料。
    quizVisible = true; // 顯示選擇題方框。
    interactionTriggered = true; // 記錄這次靠近已經觸發過選擇題。
    interactionResult = null; // 清除舊的答題結果並等待作答。
  } // 結束角色接近狀態判斷。
  if (character1IsMoving) { // 角色一移動時播放走路動畫。
    const elapsedWalkFrames = floor((frameCount - character1WalkStartFrame) / animationFrameDelay); // 計算走路動畫已經經過的影格數。
    const character1WalkFrame = elapsedWalkFrames < 5 ? elapsedWalkFrames : 2 + ((elapsedWalkFrames - 5) % 3); // 先播放第 1 至第 5 張，再循環播放第 3 至第 5 張。
    drawSpriteFrame(character1WalkSprite, character1WalkFrame, character1WalkFrameCount, character1Scale, character1X, height, true); // 繪製角色一目前的走路影格並依方向翻轉。
  } else { // 角色一停止時播放站立動畫。
    const character1StopFrame = floor(frameCount / animationFrameDelay) % character1StopFrameCount; // 計算循環播放的角色一站立動畫影格。
    drawSpriteFrame(character1StopSprite, character1StopFrame, character1StopFrameCount, character1Scale, character1X, height, true); // 繪製角色一目前的站立影格並依方向翻轉。
  } // 結束角色一動畫繪製判斷。
  if (interactionResult === 'correct') { // 如果角色一答對，就播放角色二答對動畫。
    const character2CorrectFrame = floor(frameCount / animationFrameDelay) % character2CorrectFrameCount; // 計算循環播放的角色二答對動畫影格。
    drawSpriteFrame(character2CorrectSprite, character2CorrectFrame, character2CorrectFrameCount, character2Scale, character2X, height, false); // 以原始大小繪製角色二目前的答對影格。
  } else if (interactionResult === 'incorrect') { // 如果角色一答錯，就播放角色二答錯動畫。
    const character2IncorrectFrame = floor(frameCount / animationFrameDelay) % character2IncorrectFrameCount; // 計算循環播放的角色二答錯動畫影格。
    drawSpriteFrame(character2IncorrectSprite, character2IncorrectFrame, character2IncorrectFrameCount, character2Scale, character2X, height, false); // 以原始大小繪製角色二目前的答錯影格。
  } else { // 尚未作答或互動已結束時播放角色二站立動畫。
    drawSpriteFrame(character2StopSprite, 0, character2StopFrameCount, character2Scale, character2X, height, false); // 角色二靜止時固定顯示第一格，避免看起來持續移動。
  } // 結束角色二動畫繪製判斷。
  if (interactionResult === 'correct' || interactionResult === 'incorrect') { // 只有角色一作答後才顯示答題結果文字。
    const feedbackText = interactionResult === 'correct' ? 'YES' : 'NO'; // 根據作答結果選擇顯示 YES 或 NO。
    const feedbackSpriteHeight = interactionResult === 'correct' ? character2CorrectSprite.height : character2IncorrectSprite.height; // 取得目前角色二反應動畫的圖片高度。
    push(); // 暫存畫面設定，避免答題結果文字影響其他畫面元素。
    textAlign(CENTER, CENTER); // 設定答題結果文字水平與垂直置中。
    textSize(constrain(width * 0.035, 24, 42)); // 依畫面寬度設定清楚可讀的文字大小。
    textStyle(BOLD); // 將答題結果文字設定為粗體。
    stroke(255); // 加上白色文字外框以提升辨識度。
    strokeWeight(3); // 設定文字外框的粗細。
    fill(255, 0, 0); // 將答題結果文字設定為紅色。
    text(feedbackText, character2X + character2Width / 2 + 40, height - feedbackSpriteHeight - 28); // 在角色二右上方顯示紅色答題結果。
    pop(); // 還原文字繪製設定。
  } // 結束答題結果文字顯示判斷。
  if (quizVisible) { // 如果作答方框需要顯示，就在兩個角色上方繪製題目。
    drawQuizPanel(); // 繪製藍色題目方框與可點選的選項。
  } // 結束題目方框顯示判斷。
} // 結束 draw 函式。

function drawSpriteFrame(sprite, frame, frameCount, scaleAmount, centerX, bottomY, flipX) { // 從精靈圖取出單張影格並按照指定大小與方向繪製。
  const sourceFrameWidth = sprite.width / frameCount; // 計算精靈圖中單張影格的原始寬度。
  const sourceFrameHeight = sprite.height; // 取得精靈圖單張影格的原始高度。
  const displayWidth = sourceFrameWidth * scaleAmount; // 計算單張影格的顯示寬度。
  const displayHeight = sourceFrameHeight * scaleAmount; // 計算單張影格的顯示高度。
  push(); // 暫存目前的繪圖設定，避免角色翻轉影響其他畫面元素。
  translate(centerX, bottomY - displayHeight / 2); // 將繪圖原點移至角色中心並讓圖片底部貼齊畫面底部。
  if (flipX) { // 如果角色需要面向左方，就水平翻轉圖片。
    scale(facingDirection, 1); // 使用角色一目前的方向決定圖片是否翻轉。
  } // 結束圖片翻轉判斷。
  image(sprite, 0, 0, displayWidth, displayHeight, frame * sourceFrameWidth, 0, sourceFrameWidth, sourceFrameHeight); // 繪製精靈圖中指定影格並設定顯示大小。
  pop(); // 還原先前的繪圖設定。
} // 結束 drawSpriteFrame 函式。

function getQuizPanel() { // 計算選擇題方框及其選項按鈕的位置與大小。
  const panelWidth = width / 4; // 設定題目方框寬度為畫布寬度的四分之一。
  const panelHeight = height / 4; // 設定題目方框高度為畫布高度的四分之一。
  const panelX = (width - panelWidth) / 2; // 設定題目方框在畫布水平中央的位置。
  const panelY = (height - panelHeight) / 2; // 設定題目方框在畫布垂直中央的位置。
  const buttonX = panelX + panelWidth * 0.06; // 設定選項按鈕從題目方框左側開始的位置。
  const buttonWidth = panelWidth * 0.88; // 設定選項按鈕的寬度。
  const buttonHeight = panelHeight * 0.16; // 設定選項按鈕的高度。
  const buttonGap = panelHeight * 0.025; // 設定選項按鈕彼此之間的垂直間距。
  const firstButtonY = panelY + panelHeight * 0.42; // 設定第一個選項按鈕的垂直位置。
  return { panelX, panelY, panelWidth, panelHeight, buttonX, buttonWidth, buttonHeight, buttonGap, firstButtonY }; // 回傳繪製與判斷選項所需的位置資料。
} // 結束 getQuizPanel 函式。

function drawQuizPanel() { // 在畫面中央繪製藍色選擇題方框與選項。
  const panel = getQuizPanel(); // 取得題目方框與按鈕的大小及位置。
  const titleSize = constrain(panel.panelHeight * 0.095, 12, 20); // 依方框高度計算適合的標題文字大小。
  const questionSize = constrain(panel.panelHeight * 0.09, 12, 18); // 依方框高度計算適合的題目文字大小。
  const optionSize = constrain(panel.panelHeight * 0.075, 11, 16); // 依方框高度計算適合的選項文字大小。
  rectMode(CORNER); // 設定方框使用左上角座標繪製。
  noStroke(); // 關閉題目方框與按鈕的外框。
  fill(30, 105, 200); // 設定題目方框為藍色底色。
  rect(panel.panelX, panel.panelY, panel.panelWidth, panel.panelHeight, 12); // 繪製寬高各為畫布四分之一的藍色方框。
  fill(255); // 將標題與題目文字設定為白色。
  textAlign(CENTER, CENTER); // 設定題目文字水平與垂直置中。
  textSize(titleSize); // 設定題目方框標題的文字大小。
  text('請選擇答案', panel.panelX + panel.panelWidth / 2, panel.panelY + panel.panelHeight * 0.11); // 在方框上方顯示作答提示。
  textSize(questionSize); // 設定題目文字大小。
  text(currentQuizQuestion.question, panel.panelX + panel.panelWidth / 2, panel.panelY + panel.panelHeight * 0.29); // 在方框中顯示目前輪到的題目。
  for (let optionIndex = 0; optionIndex < currentQuizQuestion.options.length; optionIndex += 1) { // 逐一繪製目前題目的所有選項按鈕。
    const buttonY = panel.firstButtonY + optionIndex * (panel.buttonHeight + panel.buttonGap); // 計算目前選項按鈕的垂直位置。
    fill(255); // 將選項按鈕設定為白色底色。
    rect(panel.buttonX, buttonY, panel.buttonWidth, panel.buttonHeight, 5); // 繪製目前的白色選項按鈕。
    fill(20, 65, 130); // 將選項文字設定為深藍色。
    textSize(optionSize); // 設定選項文字的大小。
    text(currentQuizQuestion.options[optionIndex], panel.buttonX + panel.buttonWidth / 2, buttonY + panel.buttonHeight / 2); // 在選項按鈕中央顯示目前的選項文字。
  } // 結束選項按鈕繪製迴圈。
  rectMode(CENTER); // 還原矩形預設的中心座標模式。
} // 結束 drawQuizPanel 函式。

function answerQuiz(optionIndex) { // 接收學生的作答並設定角色二的反應動畫。
  if (!quizVisible || interactionResult !== null) { // 如果題目已關閉或已經作答，就不重複處理答案。
    return; // 結束這次作答處理。
  } // 結束作答狀態檢查。
  interactionResult = optionIndex === currentQuizQuestion.correctOptionIndex ? 'correct' : 'incorrect'; // 根據目前題目的正確答案記錄作答結果。
  quizVisible = false; // 作答後立即隱藏題目方框。
} // 結束 answerQuiz 函式。

function mousePressed() { // 判斷滑鼠點擊是否選中了題目中的某個選項。
  if (!quizVisible) { // 如果題目方框沒有顯示，就不處理滑鼠點擊。
    return; // 結束滑鼠點擊處理。
  } // 結束題目顯示狀態檢查。
  const panel = getQuizPanel(); // 取得目前題目選項按鈕的位置與大小。
  for (let optionIndex = 0; optionIndex < currentQuizQuestion.options.length; optionIndex += 1) { // 逐一檢查目前題目的選項按鈕是否被點選。
    const buttonY = panel.firstButtonY + optionIndex * (panel.buttonHeight + panel.buttonGap); // 計算目前選項按鈕的垂直位置。
    const insideButton = mouseX >= panel.buttonX && mouseX <= panel.buttonX + panel.buttonWidth && mouseY >= buttonY && mouseY <= buttonY + panel.buttonHeight; // 檢查滑鼠是否位於目前選項按鈕範圍內。
    if (insideButton) { // 如果滑鼠點選了目前選項，就送出該選項答案。
      answerQuiz(optionIndex); // 根據選項序號設定角色二的答題反應。
      return false; // 阻止瀏覽器執行滑鼠點擊的預設行為。
    } // 結束選項點擊判斷。
  } // 結束選項按鈕檢查迴圈。
} // 結束 mousePressed 函式。

function keyPressed() { // 接收鍵盤事件並支援以數字鍵回答題目。
  if (quizVisible && key >= '1' && key <= '3') { // 如果題目顯示且按下數字一至三，就用數字選擇答案。
    answerQuiz(Number(key) - 1); // 將數字鍵轉換為選項序號並送出答案。
    return false; // 阻止數字鍵事件執行瀏覽器預設行為。
  } // 結束數字鍵作答判斷。
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 判斷按下的是否為左右方向鍵。
    return false; // 阻止瀏覽器因方向鍵而捲動頁面。
  } // 結束方向鍵判斷。
} // 結束 keyPressed 函式。

function windowResized() { // 瀏覽器視窗大小改變時重新調整畫布與角色位置。
  resizeCanvas(windowWidth, windowHeight); // 將畫布調整為新的瀏覽器視窗大小。
  character2X = width / 3; // 讓角色二重新固定在畫布水平位置的三分之一處。
  character1X = (width * 2) / 3; // 將角色一重新放到畫布水平位置的三分之二處。
  quizVisible = false; // 視窗尺寸改變時先隱藏題目方框。
  interactionTriggered = false; // 允許角色一再次接近時觸發選擇題。
  interactionResult = null; // 清除舊的作答結果並讓角色二恢復站立動畫。
} // 結束 windowResized 函式。
