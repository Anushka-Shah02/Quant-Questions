import React, { useEffect, useState } from "react";
import "./Questions.css";
import cross from "../images/cross.png";
import Header from "./Header";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { IoMdArrowDropdown } from "react-icons/io";
import {ImCross} from 'react-icons/im';
function Questions() {
  const [searched, setSearched] = useState("");
  const [searchval, setSearchVal] = useState("");
  const [enableSearch, setEnableSearch] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [difficultyVal, setDifficultyVal] = useState("");
  const [selected, setSelected] = useState();

  const [categoryVal, setCategoryVal] = useState("");
  let [random, setRandom] = useState();

  const [data, setData] = useState();
  const url = "http://localhost:8000/question";
  const user = JSON.parse(localStorage.getItem("quantuser"));

  // colums of the table
  const columnlogin = [
    {
      name: <div style={{ fontSize: 15, fontWeight: 800 }}>#</div>,
      selector: (row) => row.id,
      cell: (row) => <div style={{ fontSize: 15 }}>{row.uniqueId}</div>,
      sortable: true,
    },
    {
      name: <div style={{ fontSize: 15, fontWeight: 800 }}>Question Name</div>,
      selector: (row) => row.que,
      cell: (row) => (
        <Link to="/quedetail" state={{ id: row.uniqueId }}>
          <div
            style={{
              fontSize: 15,
              color: "#0378a6",
              fontWeight: 600,
              cursor: "pointer",
              textAlign:"left"
            }}
          >
            {row.title}
          </div>
        </Link>
      ),
      width: "300px",
      sortable: true,
    },
    {
      name: <div style={{ fontSize: 15, fontWeight: 800 }}>Difficulty</div>,
      selector: (row) => row.difficulty,
      cell: (row) => (
        
        <div
        className={
          row.difficulty==="easy"?"success1":row.difficulty==='hard'?"danger1" :"medium1"
         }
        >
          {row.difficulty}
        </div>
      ),
      sortable: true,
    },
    {
      name: <div style={{ fontSize: 15, fontWeight: 800 }}>Accept</div>,
      selector: (row) => row.accept,
      cell: (row) => (
        <div style={{ fontSize: 15 }}>
          {(row.accepted / row.submission) * 100}
        </div>
      ),
      sortable: true,
    },
    {
      name: <div style={{ fontSize: 15, fontWeight: 800 }}>Status</div>,
      selector: (row) => row.score,
      cell: (row) => (
        <div
          style={{
            fontSize: 15,
            backgroundColor: "#021775",
            borderRadius: 11,
            padding: 3,
            color: "white",
          }}
        >
          {row.score}
        </div>
      ),
      sortable: true,
    },
  ];
  const columnlogout = [
    {
      name: <div style={{ fontSize: 15, fontWeight: 800 }}>#</div>,
      selector: (row) => row.id,
      cell: (row) => <div style={{ fontSize: 15 }}>{row.uniqueId}</div>,
      sortable: true,
    },
    {
      name: <div style={{ fontSize: 15, fontWeight: 800 }}>Question Name</div>,
      selector: (row) => row.que,
      cell: (row) => (
        <Link to="/quedetail" state={{ id: row.uniqueId }}>
          <div
            style={{
              fontSize: 15,
              color: "#0378a6",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {row.title}
          </div>
        </Link>
      ),
      width: "300px",
      sortable: true,
    },
    {
      name: <div style={{ fontSize: 15, fontWeight: 800 }}>Difficulty</div>,
      selector: (row) => row.difficulty,
      cell: (row) => (
        <div
          style={{
            fontSize: 15,
            backgroundColor: "#04b521",
            borderRadius: 11,
            padding: 3,
            color: "white",
          }}
        >
          {row.difficulty}
        </div>
      ),
      sortable: true,
    },
    {
      name: <div style={{ fontSize: 15, fontWeight: 800 }}>Accept</div>,
      selector: (row) => row.accept,
      cell: (row) => (
        <div style={{ fontSize: 15 }}>
          {(row.accepted / row.submission) * 100}
        </div>
      ),
      sortable: true,
    },
  ];
  const fetchQuestions = async () => {
    const data = await fetch(`${url}/getallquestions`);
    const res = await data.json();
    random = res && Math.floor(Math.random() * res.length);
    setRandom(random, "askjvhgas");
    setData(res);
  };

  const fetchCatAndDiffQues = async (categoryVal, difficultyVal) => {
    const data = await fetch(
      `${url}/getquestions/difficultycategory/${categoryVal}/${difficultyVal}`
    );
    const res = await data.json();
    console.log(res);
    setSearched(res);
  };
  const fetchCatQues = async (categoryVal) => {
    const data = await fetch(`${url}/getquestions/category/${categoryVal}`);
    const res = await data.json();
    setSearched(res);
  };
  const fetchDiffQues = async (difficultyVal) => {
    const data = await fetch(`${url}/getquestions/difficulty/${difficultyVal}`);
    const res = await data.json();
    setSearched(res);
  };

  useEffect(() => {
    if (categoryVal.length > 0 && difficultyVal.length > 0) {
      fetchCatAndDiffQues(categoryVal, difficultyVal);
    } else if (categoryVal.length > 0) {
      fetchCatQues(categoryVal);
    } else if (difficultyVal.length > 0) {
      fetchDiffQues(difficultyVal);
    } else {
      fetchQuestions();
    }
  }, [categoryVal, difficultyVal, enableSearch, searchval]);

  // search questions
  const matched = [];
  const searchHandler = (e) => {
    if (e.target.value == "") {
      setEnableSearch(false);
    } else {
      setEnableSearch(true);
    }
    setSearchVal(e.target.value);
    const val = e.target.value;
    console.log(val);
    if (categoryVal.length < 1 && difficultyVal.length < 1) {
      data.forEach((user) => {
        const value = user.title.toLowerCase().includes(val.toLowerCase());
        if (value) {
          matched.push(user);
        }
      });
      console.log(matched);
      setSearched(matched);
    } else if (categoryVal.length > 0 || difficultyVal.length > 0) {
      searched.forEach((user) => {
        console.log(user, "userrr");
        const value = user.title.toLowerCase().includes(val.toLowerCase());
        if (value) {
          matched.push(user);
        }
      });
      console.log(matched);
      setSelected(matched);
    }
  };

  const handleCross = (value) => {
    if (value == "difficult") {
      setDifficultyVal("");
    } else if (value == "category") {
      setCategoryVal("");
    }
  };

  return (
    <>
      <Header />
      <div>
        <div className="quest-block">
          <div className="div1">
            <div className="first-left">
              <div className="solved">0/83 Solved</div>
              <div className="easy">Easy 0</div>
              <div className="mymedium">Medium 0</div>
              <div className="hard">Hard 0</div>
            </div>
            <div className="random-side">
              <Link
                to="/quedetail"
                state={{ id: random && data[random].uniqueId }}
              >
                <button className="random">Random Q</button>
              </Link>
            </div>
          </div>

          <hr style={{height:"0.7px",borderwidth:"0",color:"rgb(148, 148, 148)",backgroundcolor:"rgb(148, 148, 148)",marginTop:"15px"}}/>

          <div className="div2">
            <div className="find">
              <input
                type="text"
                value={searchval}
                onChange={searchHandler}
                placeholder="Search questions..."
                className="search"
              />
            </div>
            <div className="any">

              <select
                name="category"
                required
                style={{ border: "none" }}
                onChange={(e) => setCategoryVal(e.target.value)}
              >
                <option value="none" selected disabled hidden>
                  Category
                </option>
                <option value="Brainteasers">Brainteasers</option>
                <option value="Derivatives">Derivatives</option>
                <option value="Finance">Finance</option>
                <option value="Math">Math</option>
                <option value="NonQuant">NonQuant</option>
              </select>

              <select
                name="gender"
                required
                style={{ border: "none" }}
                onChange={(e) => setDifficultyVal(e.target.value)}
              >
                <option value="none" selected disabled hidden>
                  Difficulty
                </option>
                <option value="medium">Medium</option>
                <option value="easy">Easy</option>
                <option value="hard">Hard</option>
              </select>

            </div>
          </div>
          {categoryVal && difficultyVal && 
            <>
              <div className="category-class">
                
                <ImCross size={15} className="crossed-khushi" onClick={() => handleCross("category")} color="white"/>
                {categoryVal}
              </div>
              <div className="category-class">
               
                <ImCross size={15} className="crossed-khushi" onClick={() => handleCross("difficult")} color="white"/>
                {difficultyVal}
              </div>
            </>
          }
          {categoryVal && !difficultyVal && 
            <>
              <div className="category-class">
              <ImCross size={15} className="crossed-khushi" onClick={() => handleCross("category")} color="white"/>
                
                {categoryVal}
              </div>
            </>
          }
          {difficultyVal && !categoryVal && (
            <>
              <div className="category-class">
          
                <ImCross size={15} className="crossed-khushi" onClick={() => handleCross("difficult")} color="white"/>
                {difficultyVal}
              </div>
            </>
          )}

          <hr style={{height:"0.5px",borderwidth:"0",color:"rgb(148, 148, 148)",backgroundcolor:"rgb(148, 148, 148)",marginTop:"15px"}}/>

          <div className="div3">
            {!difficultyVal && !categoryVal && !enableSearch && (
              <DataTable
                columns={user ? columnlogin : columnlogout}
                data={data}
                striped={true}
                highlightOnHover={true}
                responsive={true}
                pagination={true}
                paginationDefaultPage={1}
                paginationPerPage={10}
              />
            )}
            {enableSearch &&
              categoryVal.length < 1 &&
              difficultyVal.length < 1 && (
                <DataTable
                  columns={user ? columnlogin : columnlogout}
                  data={searched}
                  striped={true}
                  highlightOnHover={true}
                  responsive={true}
                  pagination={true}
                  paginationDefaultPage={1}
                  paginationPerPage={10}
                />
              )}
            {(categoryVal.length > 0 || difficultyVal.length > 0) &&
              !enableSearch && (
                <DataTable
                  columns={user ? columnlogin : columnlogout}
                  data={searched}
                  striped={true}
                  highlightOnHover={true}
                  responsive={true}
                  pagination={true}
                  paginationDefaultPage={1}
                  paginationPerPage={10}
                />
              )}
            {(categoryVal.length > 0 || difficultyVal.length > 0) &&
              enableSearch && (
                <DataTable
                  columns={user ? columnlogin : columnlogout}
                  data={selected}
                  striped={true}
                  highlightOnHover={true}
                  responsive={true}
                  pagination={true}
                  paginationDefaultPage={1}
                  paginationPerPage={10}
                />
              )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Questions;
