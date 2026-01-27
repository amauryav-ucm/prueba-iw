const pianoRoll = document.getElementById("pianoRoll");

let bpm = 140;
let inst = 1;

["C", "^C", "D", "^D", "E", "F", "^F", "G", "^G", "A", "^B", "B"].forEach(
  (n) => {
    roll = document.createElement("div");
    roll.setAttribute("id", `roll${n}`);
    roll.classList.add("note-roll");
    text = document.createElement("span");
    text.classList.add("note-text");
    text.innerText = n;
    roll.append(text);
    for (let i = 0; i < 32; i++) {
      cb = document.createElement("input");
      cb.setAttribute("id", `${n}${i}`);
      cb.setAttribute("type", "checkbox");
      cb.classList.add("note");
      if (i % 8 == 7) cb.classList.add("section-end");
      cb.setAttribute("data-note", `${n}`);
      cb.setAttribute("data-time", `${i}`);
      roll.append(cb);
    }
    pianoRoll.prepend(roll);
  },
);


document.getElementById("btnGenerate").addEventListener("click", (e) => {
  let str = "";
  for (let i = 0; i < 32; i++) {
    let chord = "";
    document.querySelectorAll(`[data-time="${i}"]`).forEach((el) => {
      if (el.checked === true) chord += el.dataset.note;
    });
    if (chord !== "") str += ` [${chord}]`;
    else str += "z";
    if (i % 8 == 7) str += "|";
  }
  document.getElementById("textRoll").textContent = str;
  var visualObj = ABCJS.renderAbc("paper", `X:1\nM:4/4\nL:1/8\n%%MIDI program ${inst}\n${str}\n`);
  var myContext = new AudioContext();
  var synth = new ABCJS.synth.CreateSynth();

  synth
    .init({
      audioContext: myContext,
      visualObj: visualObj[0],
      millisecondsPerMeasure: 4*60000.0/bpm,
      options: {
        pan: [-0.3, 0.3],
      },
    })
    .then(function (results) {
      // Ready to play. The results are details about what was loaded.
      synth.prime().then(response=>{
        synth.start()
      })
    })
    .catch(function (reason) {
      console.log(reason);
    });
});

document.getElementById("btnForm").addEventListener("click", e=>{
    bpm = document.getElementById("tempo").value
    inst = document.getElementById("inst").value
})

document.addEventListener("DOMContentLoaded", e=>{
    document.getElementById("tempo").value = bpm
    document.getElementById("inst").value = inst
})