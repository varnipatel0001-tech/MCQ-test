/* =====================================================
   MCQ SHARE SYSTEM
   No backend
   No database
   Uses URL encoded test data
   ===================================================== */


/* =====================================================
   GLOBAL DATA
   ===================================================== */

let savedQuestions =
    JSON.parse(
        localStorage.getItem("mcqSavedQuestions")
    ) || [];


let builderQuestions = [];


let currentStudentTest = null;

let currentStudentQuestion = 0;

let studentScore = 0;

let totalPossibleMarks = 0;

let studentAnswered = false;


/* =====================================================
   INITIALIZE
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * First check whether the URL contains
         * a shared test.
         */

        const sharedTest =
            getTestFromURL();


        if (sharedTest) {

            loadSharedTest(
                sharedTest
            );

            return;
        }


        /*
         * Normal creator mode
         */

        showPage("home");

        renderSavedQuestions();

    }
);


/* =====================================================
   PAGE NAVIGATION
   ===================================================== */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    const page =
        document.getElementById(
            pageId
        );


    if (page) {

        page.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    /*
     * Highlight navigation
     */

    if (pageId === "home") {

        document
            .querySelectorAll(".nav-btn")[0]
            ?.classList.add("active");

    }

    if (pageId === "create") {

        document
            .querySelectorAll(".nav-btn")[1]
            ?.classList.add("active");

    }

    if (pageId === "manage") {

        document
            .querySelectorAll(".nav-btn")[2]
            ?.classList.add("active");

    }

}


/* =====================================================
   CREATE QUESTION
   ===================================================== */

function addQuestion() {

    const question = {

        id:
            Date.now() +
            Math.random(),

        question: "",

        options: [
            "",
            "",
            "",
            ""
        ],

        answer: 0,

        marks: 1,

        subject: "General",

        difficulty: "Easy"

    };


    builderQuestions.push(
        question
    );


    renderBuilder();

}


/* =====================================================
   RENDER QUESTION BUILDER
   ===================================================== */

function renderBuilder() {

    const container =
        document.getElementById(
            "builderQuestions"
        );


    container.innerHTML = "";


    builderQuestions.forEach(
        (question, questionIndex) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "builder-question";


            div.innerHTML = `

                <div class="builder-question-top">

                    <span class="question-number">
                        Question ${questionIndex + 1}
                    </span>

                    <button
                        class="remove-question"
                        onclick="removeQuestion(${questionIndex})"
                    >
                        Delete
                    </button>

                </div>


                <textarea
                    placeholder="Enter your question..."
                    onchange="updateQuestionText(
                        ${questionIndex},
                        this.value
                    )"
                >${escapeHTML(
                    question.question
                )}</textarea>


                <div class="option-header">

                    <span>
                        Options
                    </span>

                    <button
                        class="add-option-btn"
                        onclick="addBuilderOption(
                            ${questionIndex}
                        )"
                    >
                        + Add option
                    </button>

                </div>


                <div
                    id="options-${questionIndex}"
                ></div>


                <label>
                    Marks for this question
                </label>

                <input
                    type="number"
                    min="1"
                    value="${question.marks || 1}"
                    placeholder="Marks (e.g. 1, 2, 5)"
                    onchange="updateMarks(
                        ${questionIndex},
                        this.value
                    )"
                >


                <label>
                    Subject / Topic
                </label>

                <input
                    type="text"
                    value="${escapeAttribute(
                        question.subject
                    )}"
                    placeholder="Example: C++"
                    onchange="updateSubject(
                        ${questionIndex},
                        this.value
                    )"
                >


                <label>
                    Difficulty
                </label>

                <select
                    onchange="updateDifficulty(
                        ${questionIndex},
                        this.value
                    )"
                >

                    <option
                        value="Easy"
                        ${question.difficulty === "Easy"
                            ? "selected"
                            : ""}
                    >
                        Easy
                    </option>

                    <option
                        value="Medium"
                        ${question.difficulty === "Medium"
                            ? "selected"
                            : ""}
                    >
                        Medium
                    </option>

                    <option
                        value="Hard"
                        ${question.difficulty === "Hard"
                            ? "selected"
                            : ""}
                    >
                        Hard
                    </option>

                </select>

            `;


            container.appendChild(div);


            renderBuilderOptions(
                questionIndex
            );

        }
    );


    if (
        builderQuestions.length === 0
    ) {

        container.innerHTML = `
            <div
                style="
                    text-align:center;
                    padding:30px;
                    color:#888;
                "
            >
                No questions yet.
                Click "+ Add Question".
            </div>
        `;

    }

}


/* =====================================================
   RENDER OPTIONS
   ===================================================== */

function renderBuilderOptions(
    questionIndex
) {

    const container =
        document.getElementById(
            `options-${questionIndex}`
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const question =
        builderQuestions[
            questionIndex
        ];


    question.options.forEach(
        (option, optionIndex) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "builder-option";


            row.innerHTML = `

                <input
                    type="radio"
                    name="correct-${questionIndex}"
                    ${question.answer === optionIndex
                        ? "checked"
                        : ""}
                    onchange="
                        setCorrectAnswer(
                            ${questionIndex},
                            ${optionIndex}
                        )
                    "
                >


                <input
                    type="text"
                    value="${escapeAttribute(option)}"
                    placeholder="Option ${
                        optionIndex + 1
                    }"
                    onchange="
                        updateOption(
                            ${questionIndex},
                            ${optionIndex},
                            this.value
                        )
                    "
                >


                <button
                    class="remove-option"
                    onclick="
                        removeBuilderOption(
                            ${questionIndex},
                            ${optionIndex}
                        )
                    "
                >
                    ×
                </button>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   UPDATE QUESTION
   ===================================================== */

function updateQuestionText(
    questionIndex,
    value
) {

    builderQuestions[
        questionIndex
    ].question = value;

}


/* =====================================================
   UPDATE MARKS
   ===================================================== */

function updateMarks(
    questionIndex,
    value
) {

    const parsed = parseInt(value, 10);

    builderQuestions[
        questionIndex
    ].marks = isNaN(parsed) || parsed < 1 ? 1 : parsed;

}


/* =====================================================
   UPDATE OPTION
   ===================================================== */

function updateOption(
    questionIndex,
    optionIndex,
    value
) {

    builderQuestions[
        questionIndex
    ].options[
        optionIndex
    ] = value;

}


/* =====================================================
   UPDATE SUBJECT
   ===================================================== */

function updateSubject(
    questionIndex,
    value
) {

    builderQuestions[
        questionIndex
    ].subject =
        value.trim() || "General";

}


/* =====================================================
   UPDATE DIFFICULTY
   ===================================================== */

function updateDifficulty(
    questionIndex,
    value
) {

    builderQuestions[
        questionIndex
    ].difficulty = value;

}


/* =====================================================
   SET CORRECT ANSWER
   ===================================================== */

function setCorrectAnswer(
    questionIndex,
    optionIndex
) {

    builderQuestions[
        questionIndex
    ].answer = optionIndex;

}


/* =====================================================
   ADD OPTION
   ===================================================== */

function addBuilderOption(
    questionIndex
) {

    builderQuestions[
        questionIndex
    ].options.push("");


    renderBuilderOptions(
        questionIndex
    );

}


/* =====================================================
   REMOVE OPTION
   ===================================================== */

function removeBuilderOption(
    questionIndex,
    optionIndex
) {

    const question =
        builderQuestions[
            questionIndex
        ];


    if (
        question.options.length <= 2
    ) {

        alert(
            "A question needs at least 2 options."
        );

        return;
    }


    question.options.splice(
        optionIndex,
        1
    );


    /*
     * Fix correct answer index
     */

    if (
        question.answer === optionIndex
    ) {

        question.answer = 0;

    }

    else if (
        question.answer > optionIndex
    ) {

        question.answer--;

    }


    renderBuilderOptions(
        questionIndex
    );

}


/* =====================================================
   REMOVE QUESTION
   ===================================================== */

function removeQuestion(
    questionIndex
) {

    builderQuestions.splice(
        questionIndex,
        1
    );


    renderBuilder();

}


/* =====================================================
   GENERATE SHAREABLE LINK
   ===================================================== */

function generateShareLink() {

    const title =
        document
            .getElementById(
                "testTitle"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "testDescription"
            )
            .value
            .trim();


    /* VALIDATION */

    if (!title) {

        alert(
            "Please enter a test title."
        );

        return;
    }


    if (
        builderQuestions.length === 0
    ) {

        alert(
            "Add at least one question."
        );

        return;
    }


    for (
        let i = 0;
        i < builderQuestions.length;
        i++
    ) {

        const q =
            builderQuestions[i];


        if (!q.question.trim()) {

            alert(
                `Question ${
                    i + 1
                } is empty.`
            );

            return;
        }


        if (
            q.options.length < 2
        ) {

            alert(
                `Question ${
                    i + 1
                } needs at least 2 options.`
            );

            return;
        }


        if (
            q.options.some(
                option =>
                    !option.trim()
            )
        ) {

            alert(
                `Fill all options in Question ${
                    i + 1
                }.`
            );

            return;
        }


        if (
            q.answer < 0 ||
            q.answer >= q.options.length
        ) {

            alert(
                `Select the correct answer for Question ${
                    i + 1
                }.`
            );

            return;
        }

    }


    /*
     * Create test object
     */

    const test = {

        title: title,

        description:
            description,

        questions:
            builderQuestions.map(
                q => ({

                    question:
                        q.question.trim(),

                    options:
                        q.options.map(
                            o => o.trim()
                        ),

                    answer:
                        q.answer,

                    marks:
                        q.marks || 1,

                    subject:
                        q.subject,

                    difficulty:
                        q.difficulty

                })
            )

    };


    /*
     * Convert test → JSON
     */

    const json =
        JSON.stringify(test);


    /*
     * Encode JSON
     *
     * Base64 makes it safe to put
     * inside the URL.
     */

    const encoded =
        encodeBase64Unicode(json);


    /*
     * Create URL
     */

    const baseURL =
        window.location.origin +
        window.location.pathname;


    const shareURL =
        `${baseURL}#test=${encoded}`;


    /*
     * Put URL in share page
     */

    document.getElementById(
        "shareLink"
    ).value = shareURL;


    /*
     * Show share page
     */

    showPage(
        "sharePage"
    );

}


/* =====================================================
   COPY SHARE LINK
   ===================================================== */

async function copyShareLink() {

    const input =
        document.getElementById(
            "shareLink"
        );


    try {

        await navigator.clipboard.writeText(
            input.value
        );

        showToast(
            "Link copied!"
        );

    }

    catch {

        input.select();

        document.execCommand(
            "copy"
        );

        showToast(
            "Link copied!"
        );

    }

}


/* =====================================================
   NATIVE SHARE
   ===================================================== */

async function shareTest() {

    const link =
        document.getElementById(
            "shareLink"
        ).value;


    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title:
                    "MCQ Test",

                text:
                    "Take this MCQ test:",

                url:
                    link

            });

        }

        catch {

            /*
             * User cancelled share.
             * Do nothing.
             */

        }

    }

    else {

        await copyShareLink();

    }

}


/* =====================================================
   LOAD SHARED TEST
   ===================================================== */

function getTestFromURL() {

    const hash =
        window.location.hash;


    if (
        !hash.startsWith("#test=")
    ) {

        return null;

    }


    try {

        const encoded =
            hash.substring(
                6
            );


        const json =
            decodeBase64Unicode(
                encoded
            );


        const test =
            JSON.parse(json);


        return test;

    }

    catch (error) {

        console.error(
            "Invalid test link:",
            error
        );


        return null;

    }

}


/* =====================================================
   DISPLAY SHARED TEST
   ===================================================== */

function loadSharedTest(
    test
) {

    /*
     * Hide creator navigation.
     */

    document.querySelector(
        "header"
    ).style.display = "none";


    currentStudentTest =
        test;


    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    document
        .getElementById(
            "studentTest"
        )
        .classList.add(
            "active"
        );


    document.getElementById(
        "studentTestTitle"
    ).innerText =
        test.title;


    document.getElementById(
        "studentTestDescription"
    ).innerText =
        test.description ||
        "Test your knowledge.";


    document.getElementById(
        "studentQuestionCount"
    ).innerText =
        test.questions.length;

}


/* =====================================================
   START STUDENT TEST
   ===================================================== */

function startStudentTest() {

    if (
        !currentStudentTest ||
        !currentStudentTest.questions ||
        currentStudentTest.questions.length === 0
    ) {

        return;
    }


    currentStudentQuestion = 0;

    studentScore = 0;

    studentAnswered = false;


    /*
     * Calculate Total Possible Marks across all questions
     */

    totalPossibleMarks = currentStudentTest.questions.reduce(
        (sum, q) => sum + (q.marks || 1),
        0
    );


    /*
     * Shuffle question order.
     *
     * We make a copy so the original
     * test data is not modified.
     */

    currentStudentTest.questions =
        shuffleArray(
            currentStudentTest.questions
        );


    document.getElementById(
        "testIntro"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "studentQuestionScreen"
    ).classList.remove(
        "hidden"
    );


    document.getElementById(
        "studentResult"
    ).classList.add(
        "hidden"
    );


    showStudentQuestion();

}


/* =====================================================
   SHOW STUDENT QUESTION
   ===================================================== */

function showStudentQuestion() {

    const question =
        currentStudentTest.questions[
            currentStudentQuestion
        ];


    studentAnswered = false;


    document.getElementById(
        "studentQuestionNumber"
    ).innerText =
        `Question ${
            currentStudentQuestion + 1
        } / ${
            currentStudentTest.questions.length
        }`;


    document.getElementById(
        "studentScore"
    ).innerText =
        `Score: ${studentScore} / ${totalPossibleMarks} Marks`;


    const percentage =
        (
            currentStudentQuestion /
            currentStudentTest.questions.length
        ) * 100;


    document.getElementById(
        "studentProgress"
    ).style.width =
        `${percentage}%`;


    document.getElementById(
        "studentMarks"
    ).innerText =
        `Marks: ${question.marks || 1}`;


    document.getElementById(
        "studentSubject"
    ).innerText =
        question.subject;


    document.getElementById(
        "studentDifficulty"
    ).innerText =
        question.difficulty;


    document.getElementById(
        "studentQuestion"
    ).innerText =
        question.question;


    const container =
        document.getElementById(
            "studentOptions"
        );


    container.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "student-option";


            button.innerText =
                `${String.fromCharCode(
                    65 + index
                )}. ${option}`;


            button.onclick =
                () =>
                    checkStudentAnswer(
                        index
                    );


            container.appendChild(
                button
            );

        }
    );


    document.getElementById(
        "studentFeedback"
    ).innerText = "";

}


/* =====================================================
   CHECK STUDENT ANSWER
   ===================================================== */

function checkStudentAnswer(
    selectedIndex
) {

    if (
        studentAnswered
    ) {

        return;

    }


    studentAnswered = true;


    const question =
        currentStudentTest.questions[
            currentStudentQuestion
        ];


    const buttons =
        document.querySelectorAll(
            ".student-option"
        );


    /*
     * Disable all buttons immediately so student cannot guess again
     */

    buttons.forEach(button => {

        button.disabled = true;

    });


    const qMarks = question.marks || 1;


    if (
        selectedIndex ===
        question.answer
    ) {

        /*
         * CORRECT
         */

        studentScore += qMarks;


        buttons[
            selectedIndex
        ].classList.add(
            "correct"
        );


        document.getElementById(
            "studentFeedback"
        ).innerText =
            `✓ Correct! (+${qMarks} mark${qMarks > 1 ? "s" : ""})`;

    }

    else {

        /*
         * WRONG
         *
         * Highlight wrong choice and indicate correct option
         */

        buttons[
            selectedIndex
        ].classList.add(
            "wrong"
        );


        if (buttons[question.answer]) {

            buttons[
                question.answer
            ].classList.add(
                "correct"
            );

        }


        document.getElementById(
            "studentFeedback"
        ).innerText =
            "✕ Wrong answer! Moving to next question...";

    }


    document.getElementById(
        "studentScore"
    ).innerText =
        `Score: ${studentScore} / ${totalPossibleMarks} Marks`;


    /*
     * Automatically move to next question after delay
     */

    setTimeout(
        nextStudentQuestion,
        1200
    );

}


/* =====================================================
   NEXT STUDENT QUESTION
   ===================================================== */

function nextStudentQuestion() {

    currentStudentQuestion++;


    if (
        currentStudentQuestion >=
        currentStudentTest.questions.length
    ) {

        finishStudentTest();

        return;
    }


    showStudentQuestion();

}


/* =====================================================
   FINISH STUDENT TEST
   ===================================================== */

function finishStudentTest() {

    document.getElementById(
        "studentQuestionScreen"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "studentResult"
    ).classList.remove(
        "hidden"
    );


    const percentage =
        totalPossibleMarks > 0
            ? Math.round((studentScore / totalPossibleMarks) * 100)
            : 0;


    document.getElementById(
        "studentFinalScore"
    ).innerText =
        `${studentScore} / ${totalPossibleMarks}`;


    let message;


    if (
        percentage >= 90
    ) {

        message =
            `Excellent! ${percentage}%`;

    }

    else if (
        percentage >= 75
    ) {

        message =
            `Good job! ${percentage}%`;

    }

    else if (
        percentage >= 50
    ) {

        message =
            `Keep practicing. ${percentage}%`;

    }

    else {

        message =
            `More practice needed. ${percentage}%`;

    }


    document.getElementById(
        "studentResultMessage"
    ).innerText =
        message;


    document.getElementById(
        "studentProgress"
    ).style.width =
        "100%";

}


/* =====================================================
   SAVED QUESTIONS
   ===================================================== */

function saveCurrentQuestions() {

    builderQuestions.forEach(
        question => {

            savedQuestions.push(
                question
            );

        }
    );


    localStorage.setItem(
        "mcqSavedQuestions",
        JSON.stringify(
            savedQuestions
        )
    );


    renderSavedQuestions();

}


/* =====================================================
   RENDER SAVED QUESTIONS
   ===================================================== */

function renderSavedQuestions() {

    const container =
        document.getElementById(
            "savedQuestions"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        savedQuestions.length === 0
    ) {

        container.innerHTML = `
            <div class="saved-item">
                <p>
                    No saved questions.
                </p>
            </div>
        `;

        return;
    }


    savedQuestions.forEach(
        (question, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "saved-item";


            div.innerHTML = `

                <h3>
                    ${index + 1}.
                    ${escapeHTML(
                        question.question
                    )}
                </h3>

                <p>
                    Marks: ${question.marks || 1}
                    •
                    ${escapeHTML(
                        question.subject
                    )}
                    •
                    ${escapeHTML(
                        question.difficulty
                    )}
                </p>

            `;


            container.appendChild(
                div
            );

        }
    );

}


/* =====================================================
   SHUFFLE
   ===================================================== */

function shuffleArray(
    array
) {

    const copy =
        [...array];


    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            copy[i],
            copy[j]
        ] =
        [
            copy[j],
            copy[i]
        ];

    }


    return copy;

}


/* =====================================================
   BASE64 ENCODING
   ===================================================== */

function encodeBase64Unicode(
    text
) {

    const bytes =
        new TextEncoder().encode(
            text
        );


    let binary = "";


    bytes.forEach(
        byte => {

            binary +=
                String.fromCharCode(
                    byte
                );

        }
    );


    return btoa(
        binary
    )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

}


/* =====================================================
   BASE64 DECODING
   ===================================================== */

function decodeBase64Unicode(
    encoded
) {

    let base64 =
        encoded
            .replace(/-/g, "+")
            .replace(/_/g, "/");


    while (
        base64.length % 4
    ) {

        base64 += "=";

    }


    const binary =
        atob(base64);


    const bytes =
        Uint8Array.from(
            binary,
            char =>
                char.charCodeAt(0)
        );


    return new TextDecoder()
        .decode(bytes);

}


/* =====================================================
   TOAST
   ===================================================== */

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.innerText =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2000
    );

}


/* =====================================================
   SECURITY HELPERS
   ===================================================== */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


function escapeAttribute(
    text
) {

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        );

}