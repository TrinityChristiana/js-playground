const formatTicket = (ticket) => ({
  title: ticket.title,
  body: ticket.body,
  labels: ticket.labels,
});

const postTicketToTarget = (target, issues, updateProgress) =>
  new Promise((resolve, reject) => {
    const formattedTickets = issues.map(formatTicket);
    console.log(formattedTickets);
    // const postTicketPromises = [];
    // const postTicket = (index) => {
    //     return githubRequests
    //         .postIssueTicket(target, formattedTickets[index])
    //         .then((resp) => {
    //             updateProgress(
    //                 `Issue ${index + 1} / ${
    //                     formattedTickets.length
    //                 } copied`,
    //                 formattedTickets.length,
    //                 target
    //             );
    //             return resp;
    //         });
    // };

    // let callCount = 0;
    // postTicketPromises.push(postTicket(callCount));
    // const repeater = setInterval(function () {
    //     callCount += 1;
    //     if (callCount < formattedTickets.length) {
    //         postTicketPromises.push(postTicket(callCount));
    //     } else {
    //         resolve(Promise.all(postTicketPromises));
    //         clearInterval(repeater);
    //     }
    // }, 1000);
    resolve("test")
  });

export { postTicketToTarget };
