import { Tabs, Input, Button, Card, Avatar, Divider, Modal } from "antd";
import React, { Component } from "react";
import "../../css/User/FriendList.scss";
import UserService from "../../services/userService";
import withSocket from "../../helpers/withSocket";
class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      friendRequests: [],
      friendRequestsSent: [],
      friendSearchList: [],
      searchQuery: "",
      searchQueryFriend: "",
      open: false,
      addedFriends: {},
      usersOnline: {},
    };
    this.userService = new UserService();
  }

  componentDidMount() {
    this.initializeSocket();
    this.initializeFriend();
  }

  initializeFriend = async () => {
    const { id } = this.props;
    const friends = await this.userService.getFriendsList(id);
    const friendRequests = await this.userService.getFriendRequestsList(id);
    const friendRequestsSent = await this.userService.getFriendRequestsSentList(
      id
    );
    this.setState({
      friends: friends.data,
      friendRequests: friendRequests.data,
      friendRequestsSent: friendRequestsSent.data,
    });
  };
  initializeSocket = () => {
    const { socket } = this.props;

    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    }
    socket
      .emit("online_status")
      .on("cancelFriendRequest", (friend) => {
        if (!friend || !friend._id) return; // Kiểm tra dữ liệu hợp lệ
        this.setState((prevState) => ({
          friendRequests: prevState.friendRequests.filter(
            (item) => item._id !== friend._id
          ),
        }));
      })
      .on("acceptFriendRequest", (friend) => {
        if (!friend || !friend._id) return; // Kiểm tra dữ liệu hợp lệ
        this.setState((prevState) => ({
          friends: prevState.friends.some((f) => f._id === friend._id)
            ? prevState.friends
            : [...prevState.friends, friend], // Tránh thêm trùng bạn bè
          friendRequestsSent: prevState.friendRequestsSent.filter(
            (item) => item._id !== friend._id
          ),
        }));
      })
      .on("declineFriendRequest", (friend) => {
        if (!friend || !friend._id) return; // Kiểm tra dữ liệu hợp lệ
        this.setState((prevState) => ({
          friendRequestsSent: prevState.friendRequestsSent.filter(
            (item) => item._id !== friend._id
          ),
        }));
      })
      .on("online_status_update", (usersOnline) => {
        if (!usersOnline) return; // Kiểm tra dữ liệu hợp lệ
        console.log("usersOnline", usersOnline);
        this.setState({ usersOnline });
      });
  };

  componentWillUnmount() {
    const { socket } = this.props;
    if (socket) {
      socket.off("cancelFriendRequest");
      socket.off("acceptFriendRequest");
      socket.off("declineFriendRequest");
      socket.off("online_status_update");
    }
  }

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value.toLowerCase() });
  };

  filterListByName = (list) => {
    if (!list || !Array.isArray(list)) {
      return []; // Trả về mảng rỗng nếu list không hợp lệ
    }
    const { searchQuery, usersOnline } = this.state;

    // Sort the list by online status (online first)
    const sortedList = [...list].sort((a, b) => {
      const aOnline = usersOnline[a._id] ? 1 : 0;
      const bOnline = usersOnline[b._id] ? 1 : 0;
      return bOnline - aOnline; // Online users first
    });

    // Return the sorted list if no search query is entered
    if (!searchQuery) {
      return sortedList;
    }

    // Filter the sorted list by name if there is a search query
    return sortedList.filter((item) =>
      item.profile.name.toLowerCase().includes(searchQuery)
    );
  };

  handleAcceptFriendRequest = async (friendId) => {
    const { friends, friendRequests } = this.state;
    try {
      const response = await this.userService.acceptFriendRequest({
        userId: this.props.id,
        requesterId: friendId,
      });
      console.log("Friend request accepted successfully:", response.data);
      this.setState({
        ...this.state,
        friends: [response.data.friend, ...friends],
        friendRequests: friendRequests.filter(
          (item) => item._id !== response.data.friend._id
        ),
      });

      // Update your state or UI as needed
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  handleDeclineFriendRequest = async (friendId) => {
    const { friendRequests } = this.state;
    try {
      const response = await this.userService.declineFriendRequest(
        this.props.id,
        friendId
      );
      console.log("Friend request declined successfully:", response.data);
      this.setState({
        ...this.state,
        friendRequests: friendRequests.filter(
          (item) => item._id !== response.data.friend._id
        ),
      });

      // Update your state or UI as needed
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };
  handleSendFriendRequest = async (friendId) => {
    const { friendRequests, addedFriends } = this.state;
    try {
      const response = await this.userService.sendFriendRequest({
        userId: this.props.id,
        targetId: friendId,
      });
      console.log("Friend request canceled successfully:", response.data);
      this.setState({
        ...this.state,
        friendRequests: [response.data.friend, ...friendRequests],
        addedFriends: {
          ...addedFriends,
          [friendId]: true, // Đánh dấu bạn đã được thêm
        },
      });

      // Update your state or UI as needed
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };
  handleCancelFriendRequest = async (friendId) => {
    const { friendRequestsSent } = this.state;
    try {
      const response = await this.userService.cancelFriendRequest(
        this.props.id,
        friendId
      );
      console.log("Friend request canceled successfully:", response.data);
      this.setState({
        ...this.state,
        friendRequestsSent: friendRequestsSent.filter(
          (item) => item._id !== response.data.friend._id
        ),
      });
      // Update your state or UI as needed
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };
  handleSearchFriend = (e) => {
    this.setState({ searchQueryFriend: e.target.value.toLowerCase() });
  };
  handleSearchFriendEnter = async () => {
    const { searchQueryFriend } = this.state;
    try {
      const response = await this.userService.findUserName(searchQueryFriend);
      console.log("Friend request canceled successfully:", response.data);
      this.setState({
        friendSearchList: response.data,
        searchQueryFriend: "",
      });
      // Update your state or UI as needed
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };
  render() {
    const {
      friends,
      friendRequests,
      friendRequestsSent,
      friendSearchList,
      addedFriends,
      usersOnline,
      open,
    } = this.state;
    const items = [
      {
        label: "Danh sách bạn bè",
        key: "1",
        children: (
          <>
            <Button
              className="friend__btn"
              onClick={() => this.setState({ open: true })}
            >
              Thêm bạn mới
            </Button>
            <Divider />
            <Input
              placeholder="Tìm kiếm bạn bè theo tên..."
              onChange={this.handleSearch}
              style={{ marginBottom: 10 }}
            />
            <div className="friend__container">
              {this.filterListByName(friends).length > 0 ? (
                this.filterListByName(friends).map((friend, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <Avatar
                        size={54}
                        src={friend?.profile?.avatar}
                        className="mr-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {friend?.profile.name}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            usersOnline[friend._id]
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {usersOnline[friend._id] ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Không tìm thấy bạn bè nào.</p>
              )}
            </div>
          </>
        ),
      },
      {
        label: "Lời mời kết bạn",
        key: "2",
        children: (
          <>
            <Input
              placeholder="Tìm kiếm lời mời kết bạn theo tên..."
              onChange={this.handleSearch}
              style={{ marginBottom: 10 }}
            />
            <div>
              {this.filterListByName(friendRequests).length > 0 ? (
                this.filterListByName(friendRequests).map((friend, index) => (
                  <Card
                    key={index}
                    style={{ marginBottom: 10 }}
                    actions={[
                      <Button
                        type="primary"
                        onClick={() =>
                          this.handleAcceptFriendRequest(friend._id)
                        }
                      >
                        Đồng ý
                      </Button>,
                      <Button
                        danger
                        onClick={() =>
                          this.handleDeclineFriendRequest(friend._id)
                        }
                      >
                        Từ chối
                      </Button>,
                    ]}
                  >
                    <div className="friend__content">
                      <div className="friend__avatar">
                        <Avatar size={54} src={friend?.profile?.avatar} />
                      </div>
                      <div className="friend__title">
                        <p>
                          <b>{friend?.profile?.name}</b>
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p>Không tìm thấy lời mời kết bạn nào.</p>
              )}
            </div>
          </>
        ),
      },
      {
        label: "Yêu cầu kết bạn",
        key: "3",
        children: (
          <>
            <Input
              placeholder="Tìm kiếm yêu cầu kết bạn theo tên..."
              onChange={this.handleSearch}
              style={{ marginBottom: 10 }}
            />
            <div className="friend__container">
              {this.filterListByName(friendRequestsSent).length > 0 ? (
                this.filterListByName(friendRequestsSent).map(
                  (friend, index) => (
                    <Card
                      key={index}
                      style={{ marginBottom: 10 }}
                      actions={[
                        <Button
                          danger
                          onClick={() =>
                            this.handleCancelFriendRequest(friend._id)
                          }
                        >
                          Hủy
                        </Button>,
                      ]}
                    >
                      <div className="friend__content">
                        <div className="friend__avatar">
                          <Avatar size={54} src={friend?.profile?.avatar} />
                        </div>
                        <div className="friend__title">
                          <p>
                            <b>{friend?.profile?.name}</b>
                          </p>
                        </div>
                      </div>
                    </Card>
                  )
                )
              ) : (
                <p>Không tìm thấy yêu cầu kết bạn nào.</p>
              )}
            </div>
          </>
        ),
      },
    ];

    return (
      <>
        <Tabs defaultActiveKey="1" items={items} />
        <Modal
          title="Bạn bè"
          open={open}
          onCancel={() => this.setState({ open: false })}
          footer=""
          classNames="friend__add"
        >
          <Input
            placeholder="Tìm kiếm bạn bè theo tên..."
            onChange={this.handleSearchFriend}
            onPressEnter={this.handleSearchFriendEnter}
            style={{ marginBottom: 10 }}
          />
          <Divider />
          <div className="friend__list">
            {friendSearchList.length > 0 &&
              friendSearchList.map((friend, index) => (
                <div className="friend__item">
                  <div className="friend__item--avatar">
                    <Avatar size={54} src={friend?.profile?.avatar} />
                  </div>
                  <div className="friend__item--title">
                    <p>
                      <b>{friend?.profile?.name}</b>
                    </p>
                  </div>
                  <div className="friend__item--btn">
                    <Button
                      type="primary"
                      disabled={addedFriends[friend._id]}
                      onClick={() => this.handleSendFriendRequest(friend._id)}
                    >
                      {addedFriends[friend._id] ? "Đã thêm" : "Thêm"}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Modal>
      </>
    );
  }
}

export default withSocket(FriendList);
