import { Router } from "express";

import { prismaClient } from "../";
import { isAuth } from "../middlewares/auth";
import { debug } from "console";

const router = Router();

export const initialDocData = `{ ops: [{ insert: "\n" }] }`;

router.get("/:id", isAuth, async (req, res) => {
  try {
    const document = await prismaClient.document.findFirst({
      where: {
        id: req.params.id,
        OR: [
          {
            members: {
              some: {
                user_id: req.session.user?.id,
              },
            },
          },
          {
            courseDataModel: {
              course: {
                members: {
                  some: {
                    user_id: req.session.user?.id,
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        file: true,
        members: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
            role: true,
            AssignedAt: true,
          },
        },
        courseDataModel: {
          select: {
            course: {
              select: {
                name: true,
                members: {
                  select: {
                    id: true,
                    role: true,
                    user: {
                      select: {
                        id: true,
                        username: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                      },
                    },
                    course_id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).send(document);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    await prismaClient.document.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post("/create", isAuth, async (req, res) => {
  try {
    const doc = await prismaClient.document.create({
      data: {
        name: `New Document - @${req.session.user?.username}`,
        file: JSON.stringify(initialDocData),
        members: {
          create: {
            user_id: req.session.user?.id!,
            role: "ADMIN",
          },
        },
      },
      select: {
        id: true,
      },
    });

    return res.status(201).send(doc.id);
  } catch (error) {
    debug(error);
    return res.status(400).send(error);
  }
});

router.post("/adduser", isAuth, async (req, res) => {
  try {
    await prismaClient.document.update({
      where: {
        id: req.body.docId,
      },
      data: {
        members: {
          create: {
            user: {
              connect: {
                id: req.body.userId,
              },
            },
            role: req.body.role,
          },
        },
      },
    });

    return res.status(200).send("User added");
  } catch (error) {
    return res.status(400).send(error);
  }
});

export default router;
