export default function (frontend, name, token) {
  const link = `${frontend}/login?token=${token}`;

  return `
<center>
  <div>
    <table
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      bgcolor="#F3F3F1"
    >
      <tbody>
        <tr>
          <td valign="top" bgcolor="#F3F3F1" width="100%">
            <table
              width="100%"
              role="content-container"
              align="center"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >
              <tbody>
                <tr>
                  <td width="100%">
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <table
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              border="0"
                              style="width: 100%; max-width: 600px"
                              align="center"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    role="modules-container"
                                    style="
                                      padding: 10px 10px 10px 10px;
                                      color: #484848;
                                      text-align: left;
                                    "
                                    bgcolor="#F3F3F1"
                                    width="100%"
                                    align="left"
                                  >
                                    <table
                                      role="module"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="
                                        display: none !important;
                                        opacity: 0;
                                        color: transparent;
                                        height: 0;
                                        width: 0;
                                      "
                                    >
                                      <tbody>
                                        <tr>
                                          <td role="module-content">
                                            <p>
                                              We're excited to get you
                                              activated
                                            </p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      align="center"
                                      width="100%"
                                      role="module"
                                      style="padding: 30px 24px 30px 24px"
                                      bgcolor="#FFFFFF"
                                    >
                                      <tbody>
                                        <tr role="module-content">
                                          <td height="100%" valign="top">
                                            <table
                                              width="532"
                                              style="
                                                width: 532px;
                                                border-spacing: 0;
                                                border-collapse: collapse;
                                                margin: 0px 0px 0px 0px;
                                              "
                                              cellpadding="0"
                                              cellspacing="0"
                                              align="left"
                                              border="0"
                                              bgcolor=""
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    style="
                                                      padding: 0px;
                                                      margin: 0px;
                                                      border-spacing: 0;
                                                    "
                                                  >
                                                    <table
                                                      role="module"
                                                      border="0"
                                                      cellpadding="0"
                                                      cellspacing="0"
                                                      width="100%"
                                                      style="
                                                        table-layout: fixed;
                                                      "
                                                    >
                                                      <tbody>
                                                        <tr>
                                                          <td
                                                            height="100%"
                                                            valign="top"
                                                            role="module-content"
                                                          >
                                                            <div
                                                              style="
                                                                text-align: center;
                                                              "
                                                            >
                                                              <p
                                                                style="
                                                                  line-height: 1.4;
                                                                  margin: 0px
                                                                    0px 16px
                                                                    0px;
                                                                "
                                                              >
                                                                Hi
                                                                ${name},
                                                              </p>

                                                              <p
                                                                style="
                                                                  line-height: 1.4;
                                                                  margin: 0px
                                                                    0px 16px
                                                                    0px;
                                                                "
                                                              >
                                                                Please
                                                                verify your
                                                                email to
                                                                activate
                                                                your Tafawuq
                                                                Gulf
                                                                profile.
                                                              </p>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table
                                                      role="module"
                                                      border="0"
                                                      cellpadding="0"
                                                      cellspacing="0"
                                                      width="100%"
                                                      style="
                                                        table-layout: fixed;
                                                      "
                                                    >
                                                      <tbody>
                                                        <tr>
                                                          <td
                                                            height="100%"
                                                            valign="top"
                                                            role="module-content"
                                                          >
                                                            <div>
                                                              <a
                                                                href=${link}
                                                                style="
                                                                  font-family: sans-serif;
                                                                  vertical-align: top;
                                                                  background-color: #0d6efd;
                                                                  border-radius: 30px;
                                                                  font-size: 16px;
                                                                  line-height: 24px;
                                                                  padding: 12px
                                                                    24px;
                                                                  text-align: center;
                                                                  color: #ffffff;
                                                                  font-weight: bold;
                                                                  text-decoration: none;
                                                                  display: block;
                                                                "
                                                                rel="noreferrer"
                                                                target="_blank"
                                                                >Verify
                                                                email</a
                                                              >
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</center>
`;
}
