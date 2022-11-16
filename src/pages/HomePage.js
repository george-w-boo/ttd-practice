import UserList from "../components/UserList";
import testIDs from "../test-ids.json";

const HomePage = () => {
  return (
    <div data-testid={testIDs.homePage}>
      <UserList />
    </div>
  );
};

export default HomePage;
