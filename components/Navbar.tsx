import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand" href="/">
          Housing Prediction Portal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavigation"
          aria-controls="navbarNavigation"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavigation">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Estimator
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}